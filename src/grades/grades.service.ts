import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subject } from 'src/subjects/models/subject.model';
import { User } from 'src/users/models/user.model';
import { CreateGradeDto } from './dto/create-grade.dto';
import { Grade } from './models/grade.model';
import { UpdateGradeDto } from './dto/update-grade.dto';

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
  async create(
  createGradeDto: CreateGradeDto,
  teacherId: string,
): Promise<Grade> {
  console.log('=== DEBUG CREATE GRADE ===');
  console.log('Dados recebidos:', JSON.stringify(createGradeDto, null, 2));
  console.log('Teacher ID:', teacherId);
  
  const gradeData = {
    ...createGradeDto,
    teacherId,
  };

  console.log('Dados para INSERT:', JSON.stringify(gradeData, null, 2));

  try {
    console.log('Tentando criar nota no banco...');
    const result = await this.gradeModel.create(gradeData);
    console.log('NOTA CRIADA COM SUCESSO! ID:', result.id);
    console.log('Dados retornados:', JSON.stringify(result.get({ plain: true }), null, 2));
    return result;
  } catch (error: any) {
    console.error('ERRO AO CRIAR NOTA:');
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    console.error('Detalhes:', error);
    
    // Log mais detalhado para PostgreSQL
    if (error.original) {
      console.error('❌ Erro PostgreSQL:', error.original);
    }
    
    throw error;
  }
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
        {
          model: User,
          as: 'student',
          attributes: { exclude: ['password_hash'] },
        },
        {
          model: User,
          as: 'teacher',
          attributes: { exclude: ['password_hash'] },
        },
      ],
    });
    if (!grade) {
      throw new NotFoundException(`Nota com ID ${id} não encontrada.`);
    }
    return grade;
  }

  async update(id: string, updateGradeDto: UpdateGradeDto): Promise<Grade> {
    const grade = await this.findOne(id);
    await grade.update(updateGradeDto);
    return this.findOne(id); // Retorna a nota atualizada com as associações
  }

  async remove(id: string): Promise<{ message: string }> {
    const grade = await this.findOne(id);
    const studentName = grade.student?.name || 'Aluno';
    const subjectName = grade.subject?.name || 'Disciplina';
    const gradeValue = grade.value;
  
    await grade.destroy();

    return { 
      message: `Nota ${gradeValue} do aluno ${studentName} em ${subjectName} removida com sucesso` 
    };
  }
}
