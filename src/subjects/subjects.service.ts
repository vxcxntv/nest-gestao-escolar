import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Subject } from './models/subject.model';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { FilterSubjectDto } from './dto/filter-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject)
    private subjectModel: typeof Subject,
  ) {}

  /**
   * Gera o próximo código disponível com verificação de colisão
   */
  private async generateNextCode(): Promise<string> {
    // 1. Busca o último código cadastrado para ter um ponto de partida
    const lastSubject = await this.subjectModel.findOne({
      order: [['code', 'DESC']], // Tenta pegar o maior
      attributes: ['code'],
      where: {
        code: { [Op.iLike]: 'DIS%' } // iLike ignora maiúsculas/minúsculas
      },
      paranoid: false // Inclui deletados (soft-delete) para evitar recriar códigos antigos
    });

    let nextNumber = 1;

    if (lastSubject && lastSubject.code) {
      const matches = lastSubject.code.match(/DIS(\d+)/i);
      if (matches && matches[1]) {
        nextNumber = parseInt(matches[1], 10) + 1;
      }
    }

    // 2. Loop de Segurança (Blindagem)
    // Se o cálculo acima sugerir "DIS002", mas "DIS002" já existir (por qualquer motivo),
    // o loop vai tentar "DIS003", "DIS004" até achar um livre.
    let candidateCode = `DIS${nextNumber.toString().padStart(3, '0')}`;
    
    while (true) {
      const existing = await this.subjectModel.count({
        where: { code: candidateCode },
        paranoid: false 
      });

      if (existing === 0) {
        // Código está livre!
        break;
      }

      // Código ocupado, incrementa e tenta o próximo
      nextNumber++;
      candidateCode = `DIS${nextNumber.toString().padStart(3, '0')}`;
    }

    return candidateCode;
  }

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const code = await this.generateNextCode();
    
    try {
      return await this.subjectModel.create({
        ...createSubjectDto,
        code,
      });
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        const fields = error.errors?.map((e: any) => e.path).join(', ');
        throw new ConflictException(`Conflito: Já existe um registro com este dado único (${fields}).`);
      }
      
      console.error('Erro ao criar disciplina:', error);
      throw new InternalServerErrorException('Erro ao salvar disciplina.');
    }
  }

  async findAll(filterDto: FilterSubjectDto) {
    const { page = 1, limit = 10, name, year } = filterDto;
    const where: any = {};

    if (name) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${name}%` } },
        { code: { [Op.iLike]: `%${name}%` } }
      ];
    }

    if (year) {
      where.year = year;
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await this.subjectModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['code', 'ASC']], 
    });

    return {
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: string): Promise<Subject> {
    const subject = await this.subjectModel.findByPk(id);
    if (!subject) {
      throw new NotFoundException(`Disciplina com ID ${id} não encontrada.`);
    }
    return subject;
  }

  async update(
    id: string,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    const subject = await this.findOne(id);
    try {
        return await subject.update(updateSubjectDto);
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new ConflictException('Conflito de dados: Nome ou Código já existem.');
        }
        throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const subject = await this.subjectModel.findByPk(id, {
      attributes: ['id', 'name']
    });
  
    if (!subject) {
      throw new NotFoundException(`Disciplina com ID ${id} não encontrada.`);
    }

    const subjectName = subject.getDataValue('name');
    await subject.destroy();

    return { message: `Disciplina "${subjectName}" removida com sucesso` };
  }
}