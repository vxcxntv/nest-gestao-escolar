import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subject } from 'src/subjects/models/subject.model';
import { User } from 'src/users/models/user.model';
import { CreateGradeDto } from './dto/create-grade.dto';
import { Grade } from './models/grade.model';

@Injectable()
export class GradesService {
  constructor(
    @InjectModel(Grade)
    private gradeModel: typeof Grade,
  ) {}

  /**
   * Cria um novo registro de nota.
   * @param createGradeDto Dados da nota.
   * @param teacherId ID do professor (obtido do usuário autenticado).
   * @returns A nota criada.
   */
  async create(createGradeDto: CreateGradeDto, teacherId: string): Promise<Grade> {
    const gradeData = {
      ...createGradeDto,
      teacherId, // Adiciona o ID do professor que está lançando a nota
    };
    return this.gradeModel.create(gradeData);
  }

  /**
   * Busca todas as notas de um aluno específico.
   * @param studentId O ID do aluno.
   * @returns Uma lista de notas do aluno com detalhes da disciplina e do professor.
   */
  async findAllByStudent(studentId: string): Promise<Grade[]> {
    return this.gradeModel.findAll({
      where: { studentId },
      include: [
        {
          model: Subject, // Inclui os dados da disciplina
        },
        {
          model: User,
          as: 'teacher', // Inclui os dados do professor
          attributes: { exclude: ['password_hash'] }, // Exclui dados sensíveis
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Busca uma única nota pelo ID.
   * @param id O ID da nota.
   * @returns A nota encontrada com todos os detalhes.
   */
  async findOne(id: string): Promise<Grade> {
    const grade = await this.gradeModel.findByPk(id, {
      include: [
        { model: Subject },
        { model: User, as: 'student', attributes: { exclude: ['password_hash'] } },
        { model: User, as: 'teacher', attributes: { exclude: ['password_hash'] } },
      ],
    });
    if (!grade) {
      throw new NotFoundException(`Nota com ID ${id} não encontrada.`);
    }
    return grade;
  }
}
