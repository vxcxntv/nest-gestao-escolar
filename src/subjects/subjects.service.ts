import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subject } from './models/subject.model';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject)
    private subjectModel: typeof Subject,
  ) {}

  /**
   * Cria uma nova disciplina no banco de dados.
   * @param createSubjectDto Dados para a criação da disciplina.
   * @returns A disciplina criada.
   */
  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return this.subjectModel.create(createSubjectDto as any);
  }

  /**
   * Retorna uma lista com todas as disciplinas.
   * @returns Um array de disciplinas.
   */
  async findAll(): Promise<Subject[]> {
    return this.subjectModel.findAll();
  }

  /**
   * Busca uma disciplina específica pelo seu ID.
   * @param id O ID da disciplina.
   * @returns A disciplina encontrada.
   * @throws NotFoundException se a disciplina não for encontrada.
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
   * @param id O ID da disciplina a ser atualizada.
   * @param updateSubjectDto Os novos dados para a disciplina.
   * @returns A disciplina com os dados atualizados.
   */
  async update(id: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.findOne(id);
    return subject.update(updateSubjectDto);
  }

  /**
   * Remove uma disciplina do banco de dados.
   * @param id O ID da disciplina a ser removida.
   */
  async remove(id: string): Promise<void> {
    const subject = await this.findOne(id);
    await subject.destroy();
  }
}
