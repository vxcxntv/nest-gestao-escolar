import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from 'src/users/models/user.model';
import { Class } from 'src/classes/models/class.model';
import { Grade } from 'src/grades/models/grade.model';
import { Attendance } from 'src/attendances/models/attendance.model';
import { Subject } from 'src/subjects/models/subject.model';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Class) private classModel: typeof Class,
    @InjectModel(Grade) private gradeModel: typeof Grade,
    @InjectModel(Attendance) private attendanceModel: typeof Attendance,
    @InjectModel(Subject) private subjectModel: typeof Subject,
  ) {}

  async getStudentHistory(studentId: string) {
    const student = await this.userModel.findByPk(studentId, {
      attributes: ['id', 'name', 'email']
    });

    const grades = await this.gradeModel.findAll({
      where: { studentId },
      include: [
        { model: Subject, attributes: ['id', 'name'] },
        { model: User, as: 'teacher', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const attendances = await this.attendanceModel.findAll({
      where: { studentId },
      include: [
        { model: Class, attributes: ['id', 'name'] },
        { model: Subject, attributes: ['id', 'name'] }
      ],
      order: [['date', 'DESC']]
    });

    // Calcular estatísticas
    const totalGrades = grades.length;
    const averageGrade = totalGrades > 0 
      ? grades.reduce((sum, grade) => sum + grade.value, 0) / totalGrades 
      : 0;

    const totalAttendances = attendances.length;
    const presentAttendances = attendances.filter(a => a.status === 'present').length;
    const attendanceRate = totalAttendances > 0 
      ? (presentAttendances / totalAttendances) * 100 
      : 0;

    return {
      student,
      summary: {
        averageGrade: Number(averageGrade.toFixed(2)),
        totalGrades,
        attendanceRate: Number(attendanceRate.toFixed(2)),
        totalAttendances,
        presentAttendances,
        absentAttendances: totalAttendances - presentAttendances
      },
      grades: grades.map(grade => ({
        id: grade.id,
        value: grade.value,
        description: grade.description,
        subject: grade.subject?.name,
        teacher: grade.teacher?.name,
        createdAt: grade.createdAt
      })),
      attendances: attendances.map(att => ({
        id: att.id,
        date: att.date,
        status: att.status,
        class: att.class?.name,
        subject: att.subject?.name
      }))
    };
  }

  async getClassPerformance(classId: string) {
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
      throw new Error('Turma não encontrada');
    }

    const performanceData = await Promise.all(
      classInstance.students.map(async (student) => {
        const grades = await this.gradeModel.findAll({
          where: { studentId: student.id },
          attributes: ['value']
        });

        const attendances = await this.attendanceModel.findAll({
          where: { 
            studentId: student.id,
            classId 
          }
        });

        const averageGrade = grades.length > 0 
          ? grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length 
          : 0;

        const attendanceRate = attendances.length > 0
          ? (attendances.filter(a => a.status === 'present').length / attendances.length) * 100
          : 0;

        return {
          student: {
            id: student.id,
            name: student.name,
            email: student.email
          },
          averageGrade: Number(averageGrade.toFixed(2)),
          attendanceRate: Number(attendanceRate.toFixed(2)),
          totalGrades: grades.length,
          totalAttendances: attendances.length
        };
      })
    );

    const classAverage = performanceData.length > 0
      ? performanceData.reduce((sum, data) => sum + data.averageGrade, 0) / performanceData.length
      : 0;

    const classAttendanceRate = performanceData.length > 0
      ? performanceData.reduce((sum, data) => sum + data.attendanceRate, 0) / performanceData.length
      : 0;

    return {
      class: {
        id: classInstance.id,
        name: classInstance.name,
        academicYear: classInstance.academic_year
      },
      summary: {
        totalStudents: performanceData.length,
        classAverage: Number(classAverage.toFixed(2)),
        classAttendanceRate: Number(classAttendanceRate.toFixed(2))
      },
      students: performanceData
    };
  }
}
