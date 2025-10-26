import { ApiProperty } from '@nestjs/swagger';

// --- Resposta do Dashboard Admin ---
export class AdminDashboardResponse {
  @ApiProperty({ description: 'Total de alunos no sistema.', example: 1250 })
  totalStudents: number;

  @ApiProperty({ description: 'Total de professores.', example: 50 })
  totalTeachers: number;

  @ApiProperty({ description: 'Total de turmas ativas.', example: 45 })
  totalClasses: number;

  // Propriedade corrigida para refletir o retorno do serviço: faturas ativas
  @ApiProperty({ description: 'Total de faturas PENDENTES.', example: 87 })
  activeInvoices: number; // Corrigido

  // Propriedade corrigida para refletir o cálculo no serviço
  @ApiProperty({
    description: 'Número de faturas pagas neste mês.',
    example: 250,
  })
  paidInvoicesThisMonth: number; // Corrigido

  // Propriedade corrigida para refletir o cálculo no serviço
  @ApiProperty({ description: 'Receita total neste mês.', example: 550000.5 })
  revenueThisMonth: number; // Corrigido
}

// --- Resposta do Dashboard Professor ---
export class TeacherDashboardResponse {
  // Propriedade corrigida para refletir o retorno do serviço: myClasses
  @ApiProperty({ description: 'Número de turmas lecionadas.', example: 3 })
  myClasses: number; // Corrigido

  // Propriedade corrigida para refletir o retorno do serviço: pendingGrading
  @ApiProperty({
    description: 'Número de trabalhos ou provas pendentes de correção.',
    example: 15,
  })
  pendingGrading: number; // Corrigido

  // Detalhes da próxima turma, refletindo o array de objetos no service
  @ApiProperty({
    type: 'array',
    description: 'Lista das próximas turmas (com ID, nome e ano letivo).',
    items: { type: 'object' },
  })
  nextClasses: { id: string; name: string; academicYear: number }[]; // Corrigido

  @ApiProperty({
    type: 'array',
    description: 'Avisos recentes publicados pelo professor.',
    items: { type: 'object' },
  })
  recentAnnouncements: { id: string; title: string; createdAt: Date }[];
}

// --- Resposta do Dashboard Aluno ---
export class StudentDashboardResponse {
  // Propriedade corrigida para refletir o retorno do serviço: enrolledClasses
  @ApiProperty({
    description: 'Número de turmas nas quais o aluno está matriculado.',
    example: 4,
  })
  enrolledClasses: number; // Corrigido

  @ApiProperty({ description: 'Média de notas geral do aluno.', example: 8.5 })
  averageGrade: number;

  @ApiProperty({
    description: 'Taxa de frequência (em percentual).',
    example: 95.5,
  })
  attendanceRate: number;

  @ApiProperty({
    type: 'array',
    description: 'Próximos trabalhos/provas pendentes.',
    items: { type: 'object' },
  })
  upcomingAssignments: { id: string; description: string; dueDate: Date }[];

  @ApiProperty({
    type: 'array',
    description: 'Notas recentes (Array de objetos de nota).',
    items: { type: 'object' },
  })
  recentGrades: any[];
}
