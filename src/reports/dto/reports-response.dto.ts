// src/reports/dto/reports-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class StudentHistoryResponse {
  @ApiProperty({
    example: {
      id: 'uuid',
      name: 'João Silva',
      email: 'joao.silva@escola.com'
    }
  })
  student: any;

  @ApiProperty({
    example: {
      averageGrade: 8.5,
      totalGrades: 15,
      attendanceRate: 85.5,
      totalAttendances: 100,
      presentAttendances: 85,
      absentAttendances: 15
    }
  })
  summary: {
    averageGrade: number;
    totalGrades: number;
    attendanceRate: number;
    totalAttendances: number;
    presentAttendances: number;
    absentAttendances: number;
  };

  @ApiProperty({
    example: [
      {
        id: 'uuid',
        value: 9.0,
        description: 'Prova Bimestral',
        subject: 'Matemática',
        teacher: 'Prof. Silva',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'uuid',
        value: 8.0,
        description: 'Trabalho em Grupo',
        subject: 'História',
        teacher: 'Prof. Santos',
        createdAt: '2024-01-10T14:30:00Z'
      }
    ]
  })
  grades: any[];

  @ApiProperty({
    example: [
      {
        id: 'uuid',
        date: '2024-01-15',
        status: 'present',
        class: 'Turma 301',
        subject: 'Matemática'
      },
      {
        id: 'uuid',
        date: '2024-01-14',
        status: 'absent',
        class: 'Turma 301',
        subject: 'História'
      }
    ]
  })
  attendances: any[];
}

export class ClassPerformanceResponse {
  @ApiProperty({
    example: {
      id: 'uuid',
      name: 'Turma 301',
      academicYear: 2024
    }
  })
  class: any;

  @ApiProperty({
    example: {
      totalStudents: 25,
      classAverage: 7.8,
      classAttendanceRate: 88.2
    }
  })
  summary: {
    totalStudents: number;
    classAverage: number;
    classAttendanceRate: number;
  };

  @ApiProperty({
    example: [
      {
        student: {
          id: 'uuid',
          name: 'Maria Santos',
          email: 'maria.santos@escola.com'
        },
        averageGrade: 8.5,
        attendanceRate: 92.0,
        totalGrades: 10,
        totalAttendances: 50
      },
      {
        student: {
          id: 'uuid',
          name: 'Pedro Oliveira',
          email: 'pedro.oliveira@escola.com'
        },
        averageGrade: 7.2,
        attendanceRate: 85.5,
        totalGrades: 8,
        totalAttendances: 45
      }
    ]
  })
  students: any[];
}

export class FinancialReportResponse {
  @ApiProperty({ example: 12500.50 })
  totalRevenue: number;

  @ApiProperty({ example: 45 })
  pendingInvoices: number;

  @ApiProperty({ example: 120 })
  paidInvoices: number;

  @ApiProperty({ example: 15 })
  overdueInvoices: number;

  @ApiProperty({ example: 85.7 })
  collectionRate: number;

  @ApiProperty({
    example: [
      {
        month: '2024-01',
        revenue: 12500.50,
        paidInvoices: 120,
        pendingInvoices: 45
      },
      {
        month: '2023-12',
        revenue: 11800.00,
        paidInvoices: 115,
        pendingInvoices: 40
      }
    ]
  })
  monthlyData: any[];
}
