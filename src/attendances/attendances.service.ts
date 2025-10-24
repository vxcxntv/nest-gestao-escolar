import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize'; // Necessário para filtros
import { Sequelize } from 'sequelize-typescript';
import { User, UserRole } from 'src/users/models/user.model';
import { Subject } from 'src/subjects/models/subject.model';
import { Class } from 'src/classes/models/class.model';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance, AttendanceStatus } from './models/attendance.model';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectModel(Attendance)
    private attendanceModel: typeof Attendance,
    @InjectModel(Class)
    private classModel: typeof Class,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Subject)
    private subjectModel: typeof Subject,
    private sequelize: Sequelize, 
  ) {}

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

  /**
   * Busca um registro de frequência individual pelo ID
   */
  async findOne(id: string): Promise<Attendance> {
    const attendance = await this.attendanceModel.findByPk(id, {
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
        { model: Class, attributes: ['id', 'name', 'teacherId'] },
        { model: Subject, attributes: ['id', 'name'] }
      ]
    });

    if (!attendance) {
      throw new NotFoundException(`Registro de frequência com ID ${id} não encontrado`);
    }

    return attendance;
  }

  /**
   * Atualiza um registro individual de frequência
   */
  async update(id: string, updateAttendanceDto: UpdateAttendanceDto, user: any): Promise<Attendance> {
    const attendance = await this.findOne(id);

    // Verificar permissões: apenas o professor da turma pode editar
    if (user.role === UserRole.TEACHER && attendance.class.teacherId !== user.userId) {
      throw new ForbiddenException('Você só pode editar frequências das suas próprias turmas');
    }

    await attendance.update(updateAttendanceDto);

    // Retornar o registro atualizado com as relações
    const updatedAttendance = await this.attendanceModel.findByPk(id, {
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
        { model: Class, attributes: ['id', 'name'] },
        { model: Subject, attributes: ['id', 'name'] }
      ]
    });

    if (!updatedAttendance) {
      throw new NotFoundException(`Registro de frequência com ID ${id} não encontrado`);
    }

    return updatedAttendance;
  }

  /**
   * Remove um registro individual de frequência
   */
  async remove(id: string, user: any): Promise<void> {
    const attendance = await this.findOne(id);

    // Verificar permissões: admin ou professor da turma
    if (user.role === UserRole.TEACHER && attendance.class.teacherId !== user.userId) {
      throw new ForbiddenException('Você só pode remover frequências das suas próprias turmas');
    }

    await attendance.destroy();
  }

  /**
   * Resumo de frequência de todos os alunos de uma turma
   */
  async getClassAttendanceSummary(classId: string): Promise<any> {
    const classInstance = await this.classModel.findByPk(classId, {
      include: [
        { 
          model: User, 
          as: 'students',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!classInstance) {
      throw new NotFoundException(`Turma com ID ${classId} não encontrada`);
    }

    const summary = await Promise.all(
      classInstance.students.map(async (student) => {
        const attendances = await this.attendanceModel.findAll({
          where: { 
            studentId: student.id,
            classId 
          }
        });

        const totalAttendances = attendances.length;
        const presentAttendances = attendances.filter(a => a.status === AttendanceStatus.PRESENT).length;
        const absentAttendances = totalAttendances - presentAttendances;
        const attendanceRate = totalAttendances > 0 
          ? (presentAttendances / totalAttendances) * 100 
          : 0;

        return {
          student: {
            id: student.id,
            name: student.name,
            email: student.email
          },
          totalAttendances,
          presentAttendances,
          absentAttendances,
          attendanceRate: Number(attendanceRate.toFixed(2))
        };
      })
    );

    const classTotalAttendances = summary.reduce((sum, student) => sum + student.totalAttendances, 0);
    const classPresentAttendances = summary.reduce((sum, student) => sum + student.presentAttendances, 0);
    const classAttendanceRate = classTotalAttendances > 0 
      ? (classPresentAttendances / classTotalAttendances) * 100 
      : 0;

    return {
      class: {
        id: classInstance.id,
        name: classInstance.name,
        academicYear: classInstance.academic_year
      },
      summary: {
        totalStudents: summary.length,
        classAttendanceRate: Number(classAttendanceRate.toFixed(2)),
        totalAttendances: classTotalAttendances,
        presentAttendances: classPresentAttendances,
        absentAttendances: classTotalAttendances - classPresentAttendances
      },
      students: summary
    };
  }
}
