import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/models/user.model';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './models/class.model';
import { Subject } from 'src/subjects/models/subject.model';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class)
    private classModel: typeof Class,
  ) {}

  /**
   * Cria uma nova turma.
   * @param createClassDto Dados para a criação da turma.
   * @returns A turma criada.
   */
  create(createClassDto: CreateClassDto): Promise<Class> {
    return this.classModel.create(createClassDto as any);
  }

  /**
   * Retorna uma lista com todas as turmas, incluindo os dados do professor de cada uma.
   * @returns Um array de turmas com seus respectivos professores.
   */
  findAll(): Promise<Class[]> {
    return this.classModel.findAll({
      include: [
        {
          model: User,
          as: 'teacher', // O alias é opcional aqui, mas bom para clareza
          attributes: { exclude: ['password_hash'] }, // Nunca exponha a senha!
        },
      ],
    });
  }

  /**
   * Busca uma turma específica pelo seu ID, incluindo o professor e as disciplinas associadas.
   * @param id O ID da turma.
   * @returns A turma encontrada.
   * @throws NotFoundException se a turma não for encontrada.
   */
  async findOne(id: string): Promise<Class> {
    const classInstance = await this.classModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'teacher',
          attributes: { exclude: ['password_hash'] },
        },
        {
          model: Subject, // Inclui as disciplinas da turma
          through: { attributes: [] }, // Não inclui os dados da tabela de junção
        },
      ],
    });

    if (!classInstance) {
      throw new NotFoundException(`Turma com ID ${id} não encontrada.`);
    }
    return classInstance;
  }

  /**
   * Atualiza os dados de uma turma existente.
   * @param id O ID da turma a ser atualizada.
   * @param updateClassDto Os novos dados para a turma.
   * @returns A turma com os dados atualizados.
   */
  async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const classInstance = await this.findOne(id);
    return classInstance.update(updateClassDto);
  }

  /**
   * Remove uma turma do banco de dados.
   * @param id O ID da turma a ser removida.
   */
  async remove(id: string): Promise<void> {
    const classInstance = await this.findOne(id);
    await classInstance.destroy();
  }

  /**
   * Associa uma disciplina a uma turma.
   * @param classId O ID da turma.
   * @param subjectId O ID da disciplina.
   */
  async addSubjectToClass(classId: string, subjectId: string): Promise<void> {
    const classInstance = await this.classModel.findByPk(classId);
    if (!classInstance) {
      throw new NotFoundException(`Turma com ID ${classId} não encontrada.`);
    }
    // O método `$add` é um "mixin" adicionado pelo Sequelize para gerenciar relações N:M
    await classInstance.$add('subject', subjectId);
  }

  async addStudentToClass(classId: string, studentId: string): Promise<void> {
    const classInstance = await this.classModel.findByPk(classId);
    if (!classInstance) {
      throw new NotFoundException(`Turma com ID ${classId} não encontrada.`);
    }
    // Validação extra: verificar se o usuário existe e se ele é um aluno.
    // (Isso será implementado de forma mais robusta com autenticação)
    await classInstance.$add('student', studentId);
  }

  async getStudentsFromClass(classId: string): Promise<User[]> {
    const classInstance = await this.classModel.findByPk(classId, {
      include: [
        {
          model: User,
          as: 'students',
          attributes: { exclude: ['password_hash'] },
          through: { attributes: [] }, // Não traz os dados da tabela de junção
        },
      ],
    });
    if (!classInstance) {
      throw new NotFoundException(`Turma com ID ${classId} não encontrada.`);
    }
    return classInstance.students;
  }
}
