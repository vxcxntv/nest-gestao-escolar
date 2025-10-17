import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from 'src/users/models/user.model';
import { Class } from 'src/classes/models/class.model';
import { Invoice } from 'src/invoices/models/invoice.model';
import { Grade } from 'src/grades/models/grade.model';
import { Attendance } from 'src/attendances/models/attendance.model';
import { Announcement } from 'src/announcements/models/announcement.model';
import { UserRole } from 'src/users/models/user.model';
import { InvoiceStatus } from 'src/invoices/models/invoice.model';
import { 
  AdminDashboardResponse, 
  TeacherDashboardResponse, 
  StudentDashboardResponse 
} from './dto/dashboard-response.dto'; // Importação do DTO corrigido

@Injectable()
export class DashboardsService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Class) private classModel: typeof Class,
    @InjectModel(Invoice) private invoiceModel: typeof Invoice,
    @InjectModel(Grade) private gradeModel: typeof Grade,
    @InjectModel(Attendance) private attendanceModel: typeof Attendance,
    @InjectModel(Announcement) private announcementModel: typeof Announcement,
  ) {}

  async getAdminDashboard(): Promise<AdminDashboardResponse> {
    const totalStudents = await this.userModel.count({
      where: { role: UserRole.STUDENT }
    });

    const totalTeachers = await this.userModel.count({
      where: { role: UserRole.TEACHER }
    });

    const totalClasses = await this.classModel.count();

    // Propriedade corrigida: Total de faturas PENDENTES (activeInvoices)
    const activeInvoices = await this.invoiceModel.count({
      where: { status: InvoiceStatus.PENDING }
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const paidInvoices = await this.invoiceModel.findAll({
      where: { 
        status: InvoiceStatus.PAID,
        paidAt: { [Op.gte]: startOfMonth }
      }
    });

    // Propriedades corrigidas: Receita e contagem do mês
    const paidInvoicesThisMonth = paidInvoices.length;
    const revenueThisMonth = paidInvoices.reduce((sum, invoice) => 
      sum + parseFloat(invoice.amount as any), 0
    );

    return {
      totalStudents,
      totalTeachers,
      totalClasses,
      activeInvoices,
      paidInvoicesThisMonth,
      revenueThisMonth,
    };
  }

  async getTeacherDashboard(teacherId: string): Promise<TeacherDashboardResponse> {
    // Propriedade corrigida: Total de turmas do professor (myClasses)
    const myClasses = await this.classModel.count({
      where: { teacherId }
    });

    // Simulação de tarefas pendentes
    const pendingGrading = await this.gradeModel.count({
      where: { 
        teacherId,
        value: { [Op.is]: null } // Onde o valor é nulo (nota não lançada)
      }
    });

    // Próximas turmas (exemplo)
    const nextClasses = await this.classModel.findAll({
      where: { teacherId },
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    const recentAnnouncements = await this.announcementModel.findAll({
      where: { authorId: teacherId },
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: Class }]
    });

    return {
      myClasses,
      pendingGrading,
      nextClasses: nextClasses.map(cls => ({
        id: cls.id,
        name: cls.name,
        academicYear: cls.academic_year // Usando academic_year (snake_case)
      })),
      recentAnnouncements: recentAnnouncements.map(ann => ({
        id: ann.id,
        title: ann.title,
        createdAt: ann.createdAt
      }))
    };
  }

  async getStudentDashboard(studentId: string): Promise<StudentDashboardResponse> {
    const user = await this.userModel.findByPk(studentId, {
      include: [{
        model: Class,
        as: 'enrolledClasses'
      }]
    });

    // Propriedade corrigida: Contagem de turmas matriculadas (enrolledClasses)
    const enrolledClasses = user?.enrolledClasses?.length || 0;

    // Calcular média de notas
    const grades = await this.gradeModel.findAll({
      where: { studentId },
      attributes: ['value']
    });
    
    const averageGrade = grades.length > 0 
      ? grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length 
      : 0;

    // Calcular taxa de frequência
    const attendances = await this.attendanceModel.findAll({
      where: { studentId }
    });
    
    const attendanceRate = attendances.length > 0
      ? (attendances.filter(a => a.status === 'present').length / attendances.length) * 100
      : 0;

    const upcomingAssignments = await this.gradeModel.findAll({
      where: { 
        studentId,
        value: { [Op.is]: null } // Onde o valor é nulo (nota não lançada)
      },
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    const recentGrades = await this.gradeModel.findAll({
      where: { studentId },
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'teacher' }]
    });

    return {
      enrolledClasses,
      averageGrade: Number(averageGrade.toFixed(2)),
      attendanceRate: Number(attendanceRate.toFixed(2)),
      upcomingAssignments: upcomingAssignments.map(ass => ({
        id: ass.id,
        description: ass.description,
        dueDate: ass.createdAt
      })),
      recentGrades: recentGrades.map(grade => ({
        id: grade.id,
        value: grade.value,
        description: grade.description,
        teacher: grade.teacher?.name
      }))
    };
  }
}
