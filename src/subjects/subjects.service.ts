import { Injectable, NotFoundException } from '@nestjs/common';
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
   * Gera o próximo código disponível (Ex: DIS001, DIS002)
   */
  private async generateNextCode(): Promise<string> {
    // Busca a última disciplina criada para pegar o último código
    const lastSubject = await this.subjectModel.findOne({
      order: [['createdAt', 'DESC']],
      attributes: ['code'],
    });

    let nextNumber = 1;

    if (lastSubject && lastSubject.code) {
      // Extrai o número do código (ex: de DIS005 pega 5)
      const matches = lastSubject.code.match(/DIS(\d+)/);
      if (matches && matches[1]) {
        nextNumber = parseInt(matches[1], 10) + 1;
      }
    }

    // Formata para ter 3 dígitos (ex: 1 -> "001")
    return `DIS${nextNumber.toString().padStart(3, '0')}`;
  }

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const code = await this.generateNextCode();
    
    // Mescla o DTO com o código gerado
    return this.subjectModel.create({
      ...createSubjectDto,
      code,
    });
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
      order: [['code', 'ASC']], // Ordenar por código fica mais organizado agora
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
    return subject.update(updateSubjectDto);
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