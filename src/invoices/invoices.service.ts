import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Class } from 'src/classes/models/class.model';
import { User, UserRole } from 'src/users/models/user.model';
import { CreateBatchInvoiceDto } from './dto/create-batch-invoice.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { FilterInvoiceDto } from './dto/filter-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice, InvoiceStatus } from './models/invoice.model';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice)
    private invoiceModel: typeof Invoice,
    @InjectModel(Class)
    private classModel: typeof Class,
    // Injetamos a instância do Sequelize para poder usar transações
    private sequelize: Sequelize,
  ) {}

  /**
   * Endpoint 1: POST /invoices
   * Cria uma única fatura para um aluno.
   */
  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoiceModel.create(createInvoiceDto as any);
  }

  /**
   * Endpoint 2: POST /invoices/batch
   * Cria faturas em lote para todos os alunos de uma turma.
   * Utiliza uma transação para garantir que ou todas as faturas são criadas, ou nenhuma é.
   */
  async createBatch(dto: CreateBatchInvoiceDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const classToInvoice = await this.classModel.findByPk(dto.classId, {
        include: [{ model: User, as: 'students' }],
        transaction,
      });

      if (!classToInvoice) {
        throw new NotFoundException(
          `Turma com ID ${dto.classId} não encontrada.`,
        );
      }

      if (classToInvoice.students.length === 0) {
        return {
          message:
            'A turma não possui alunos matriculados. Nenhuma fatura foi criada.',
        };
      }

      const invoicesToCreate = classToInvoice.students.map((student) => ({
        studentId: student.id,
        description: dto.description,
        amount: dto.amount,
        dueDate: dto.dueDate,
      }));

      await this.invoiceModel.bulkCreate(invoicesToCreate, { transaction });

      await transaction.commit();
      return {
        message: `${invoicesToCreate.length} faturas criadas com sucesso para a turma "${classToInvoice.name}".`,
      };
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(
        `Falha ao criar faturas em lote: ${error.message}`,
      );
    }
  }

  /**
   * Endpoint 3: GET /invoices
   * Lista todas as faturas com filtros e paginação (visão do admin).
   */
  async findAll(filterDto: FilterInvoiceDto) {
    const {
      page = 1,
      limit = 10,
      studentId,
      status,
      dueDateFrom,
      dueDateTo,
    } = filterDto;
    const where: any = {};

    if (studentId) where.studentId = studentId;
    if (status) where.status = status;
    if (dueDateFrom && dueDateTo) {
      where.dueDate = { [Op.between]: [dueDateFrom, dueDateTo] };
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await this.invoiceModel.findAndCountAll({
      where,
      limit,
      offset,
      include: [{ model: User, as: 'student', attributes: ['id', 'name'] }],
      order: [['dueDate', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  /**
   * Endpoint 4: GET /students/:studentId/invoices
   * Busca todas as faturas de um aluno específico, com verificação de permissão.
   */
  async findAllByStudent(studentId: string, user: any): Promise<Invoice[]> {
    // Permite o acesso se o usuário for ADMIN ou se for o próprio aluno/responsável.
    if (user.role !== UserRole.ADMIN && user.userId !== studentId) {
      throw new ForbiddenException(
        'Você não tem permissão para ver estas faturas.',
      );
    }
    return this.invoiceModel.findAll({
      where: { studentId },
      order: [['dueDate', 'DESC']],
    });
  }

  /**
   * Endpoint 5: GET /invoices/:id
   * Busca uma fatura específica por ID, com verificação de permissão.
   */
  async findOne(id: string, user: any): Promise<Invoice> {
    const invoice = await this.invoiceModel.findByPk(id);
    if (!invoice) {
      throw new NotFoundException(`Fatura com ID ${id} não encontrada.`);
    }

    if (user.role !== UserRole.ADMIN && user.userId !== invoice.studentId) {
      throw new ForbiddenException(
        'Você não tem permissão para ver esta fatura.',
      );
    }
    return invoice;
  }

  /**
   * Endpoint 6: PATCH /invoices/:id
   * Atualiza os dados de uma fatura.
   */
  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    // Para atualizar, o usuário já deve ser admin (verificado no controller).
    const invoice = await this.invoiceModel.findByPk(id);
    if (!invoice) {
      throw new NotFoundException(`Fatura com ID ${id} não encontrada.`);
    }
    return invoice.update(updateInvoiceDto);
  }

  /**
   * Endpoint 7: POST /invoices/:id/pay
   * Marca uma fatura como paga.
   */
  async markAsPaid(id: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findByPk(id);
    if (!invoice) {
      throw new NotFoundException(`Fatura com ID ${id} não encontrada.`);
    }
    return invoice.update({ status: InvoiceStatus.PAID, paidAt: new Date() });
  }

  /**
   * Endpoint 8: POST /invoices/:id/cancel
   * Cancela uma fatura.
   */
  async cancel(id: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findByPk(id);
    if (!invoice) {
      throw new NotFoundException(`Fatura com ID ${id} não encontrada.`);
    }
    return invoice.update({ status: InvoiceStatus.CANCELED, paidAt: null });
  }

  /**
   * Endpoint 9: GET /reports/financial/revenue
   * Calcula a receita total em um período com base nas faturas pagas.
   */
  async getRevenueReport(startDate: string, endDate: string) {
    const total = await this.invoiceModel.sum('amount', {
      where: {
        status: InvoiceStatus.PAID,
        paidAt: { [Op.between]: [startDate, endDate] },
      },
    });

    return {
      periodo: { de: startDate, ate: endDate },
      receitaTotal: total || 0,
    };
  }

  /**
   * Endpoint 10: GET /reports/financial/defaults
   * Gera um relatório de faturas vencidas e não pagas (inadimplentes).
   */
  async getDefaultsReport() {
    return this.invoiceModel.findAll({
      where: {
        status: InvoiceStatus.PENDING,
        dueDate: { [Op.lt]: new Date() }, // Onde a data de vencimento é menor que a data atual
      },
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
      ],
      order: [['dueDate', 'ASC']],
    });
  }
}
