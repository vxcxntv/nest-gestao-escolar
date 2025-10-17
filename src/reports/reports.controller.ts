import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/models/user.model';
import { ReportsService } from './reports.service';

@ApiTags('Relatórios')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('students/:studentId/history')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Gerar histórico completo do aluno' })
  @ApiParam({ name: 'studentId', description: 'ID do aluno' })
  @ApiResponse({ status: 200, description: 'Histórico gerado com sucesso' })
  getStudentHistory(
    @Param('studentId') studentId: string,
    @Request() req
  ) {
    // Verificar se o usuário tem permissão para ver este histórico
    if (req.user.role === UserRole.STUDENT && req.user.userId !== studentId) {
      throw new Error('Você só pode ver seu próprio histórico');
    }
    
    return this.reportsService.getStudentHistory(studentId);
  }

  @Get('classes/:classId/performance')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Gerar relatório de desempenho da turma' })
  @ApiParam({ name: 'classId', description: 'ID da turma' })
  @ApiResponse({ status: 200, description: 'Relatório de desempenho gerado com sucesso' })
  getClassPerformance(@Param('classId') classId: string) {
    return this.reportsService.getClassPerformance(classId);
  }
}
