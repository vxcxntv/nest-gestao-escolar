// src/dashboards/dto/dashboard-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AdminDashboardResponse {
  @ApiProperty({ example: 150 })
  totalStudents: number;

  @ApiProperty({ example: 20 })
  totalTeachers: number;

  @ApiProperty({ example: 15 })
  totalClasses: number;

  @ApiProperty({ example: 45 })
  activeInvoices: number;

  @ApiProperty({ example: 120 })
  paidInvoicesThisMonth: number;

  @ApiProperty({ example: 12500.50 })
  revenueThisMonth: number;
}

export class TeacherDashboardResponse {
  @ApiProperty({ example: 3 })
  myClasses: number;

  @ApiProperty({ example: 15 })
  pendingGrading: number;

  @ApiProperty({ 
    example: [
      { id: 'uuid', name: 'Turma 301', academicYear: 2024 },
      { id: 'uuid', name: 'Turma 302', academicYear: 2024 }
    ] 
  })
  nextClasses: any[];

  @ApiProperty({ 
    example: [
      { id: 'uuid', title: 'Prova Bimestral', createdAt: '2024-01-15T10:00:00Z' },
      { id: 'uuid', title: 'Reunião de Pais', createdAt: '2024-01-10T14:30:00Z' }
    ] 
  })
  recentAnnouncements: any[];
}

export class StudentDashboardResponse {
  @ApiProperty({ example: 5 })
  enrolledClasses: number;

  @ApiProperty({ example: 8.5 })
  averageGrade: number;

  @ApiProperty({ example: 85.5 })
  attendanceRate: number;

  @ApiProperty({ 
    example: [
      { id: 'uuid', description: 'Trabalho de História', dueDate: '2024-01-20T23:59:00Z' },
      { id: 'uuid', description: 'Prova de Matemática', dueDate: '2024-01-25T23:59:00Z' }
    ] 
  })
  upcomingAssignments: any[];

  @ApiProperty({ 
    example: [
      { id: 'uuid', value: 9.0, description: 'Prova Bimestral', teacher: 'Prof. Silva' },
      { id: 'uuid', value: 8.5, description: 'Trabalho em Grupo', teacher: 'Prof. Santos' }
    ] 
  })
  recentGrades: any[];
}
