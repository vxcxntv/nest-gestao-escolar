import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Subject } from './models/subject.model';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { FilterSubjectDto } from './dto/filter-subject.dto'; // Importe o DTO de filtro

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject)
    private subjectModel: typeof Subject,
  ) {}

  /**
   * Cria uma nova disciplina no banco de dados.
   */
  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return this.subjectModel.create(createSubjectDto as any);
  }

  /**
   * Retorna uma lista com todas as disciplinas, com suporte a filtros e paginação.
   * Agora aceita o FilterSubjectDto.
   */
  async findAll(filterDto: FilterSubjectDto) {
    const { page = 1, limit = 10, name } = filterDto;
    const where: any = {};

    // Filtro por nome (busca parcial case-insensitive)
    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await this.subjectModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']],
    });

    return {
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  /**
   * Busca uma disciplina específica pelo seu ID.
   */
  async findOne(id: string): Promise<Subject> {
    const subject = await this.subjectModel.findByPk(id);
    if (!subject) {
      throw new NotFoundException(`Disciplina com ID ${id} não encontrada.`);
    }
    return subject;
  }

  /**
   * Atualiza os dados de uma disciplina existente.
   */
  async update(
    id: string,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    const subject = await this.findOne(id);
    return subject.update(updateSubjectDto);
  }

  /**
   * Remove uma disciplina do banco de dados.
   */
  async remove(id: string): Promise<void> {
    const subject = await this.findOne(id);
    await subject.destroy();
  }
}
