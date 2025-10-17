import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize'; // Necessário para filtros
import { Sequelize } from 'sequelize-typescript';
import { User, UserRole } from 'src/users/models/user.model';
import { Subject } from 'src/subjects/models/subject.model';
import { Class } from 'src/classes/models/class.model';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FilterAttendanceDto } from './dto/filter-attendance.dto'; // Importe
import { Attendance } from './models/attendance.model';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectModel(Attendance)
    private attendanceModel: typeof Attendance,
    private sequelize: Sequelize, 
  ) {}

  /**
   * Cria múltiplos registros de frequência em lote para uma aula.
   */
  async createBatch(createAttendanceDto: CreateAttendanceDto): Promise<void> {
    const transaction = await this.sequelize.transaction();
    try {
      const { date, classId, subjectId, presences } = createAttendanceDto;

      const recordsToCreate = presences.map((presence) => ({
        date,
        classId,
        subjectId,
        studentId: presence.studentId,
        status: presence.status,
      }));

      await this.attendanceModel.bulkCreate(recordsToCreate, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Implementa o Endpoint GET /attendances
   * Lista todos os registros de frequência com filtros e paginação.
   */
  async findAll(filterDto: FilterAttendanceDto) {
    const { page = 1, limit = 10, classId, subjectId, studentId, dateFrom } = filterDto;
    const where: any = {};

    if (classId) where.classId = classId;
    if (subjectId) where.subjectId = subjectId;
    if (studentId) where.studentId = studentId;

    if (dateFrom) {
        // Filtra registros a partir da data especificada
        where.date = { [Op.gte]: dateFrom };
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await this.attendanceModel.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        { model: User, attributes: ['id', 'name'], as: 'student' },
        { model: Class, attributes: ['id', 'name'] },
        { model: Subject, attributes: ['id', 'name'] },
      ],
      order: [['date', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  /**
   * Implementa o Endpoint GET /students/:studentId/attendances
   * Consulta o histórico de frequência de um aluno específico, aplicando permissões.
   * user: Objeto do usuário logado para verificação de permissão.
   */
  async findStudentHistory(studentId: string, user: any) {
    // 1. Verificação de Permissão (Regra de Negócio)
    const isOwner = user.userId === studentId;
    const isAuthorizedRole = user.role === UserRole.ADMIN || user.role === UserRole.TEACHER;
    
    // Se não é Admin, nem Professor, nem o próprio aluno/responsável, nega o acesso.
    if (!isOwner && !isAuthorizedRole) {
        throw new ForbiddenException('Você não tem permissão para acessar o histórico de frequência deste aluno.');
    }

    // 2. Busca e Retorna os Registros
    return this.attendanceModel.findAll({
      where: { studentId },
      include: [
        { model: Class, attributes: ['name'] },
        { model: Subject, attributes: ['name'] },
      ],
      order: [['date', 'ASC']],
    });
  }
}
