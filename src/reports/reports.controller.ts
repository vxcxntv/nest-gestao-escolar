import { Controller, Get, Param, UseGuards, Request, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { UserRole } from 'src/users/models/user.model';
import { ReportsService } from './reports.service';
import { FilterFinancialReportDto } from './dto/filter-financial-report.dto';

@ApiTags('Relatórios Acadêmicos e Financeiros')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('students/:studentId/history')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Gerar histórico completo do aluno (Boletim)' })
  @ApiParam({ name: 'studentId', description: 'ID do aluno', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Histórico gerado com sucesso' })
  getStudentHistory(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Request() req
  ) {
    // A regra de permissão interna (Aluno só vê o próprio histórico)
    if (req.user.role === UserRole.STUDENT && req.user.userId !== studentId) {
      throw new Error('Você só pode ver seu próprio histórico');
    }
    
    return this.reportsService.getStudentHistory(studentId);
  }

  @Get('classes/:classId/performance')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Gerar relatório de desempenho da turma' })
  @ApiParam({ name: 'classId', description: 'ID da turma', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Relatório de desempenho gerado com sucesso' })
  getClassPerformance(@Param('classId', ParseUUIDPipe) classId: string) {
    return this.reportsService.getClassPerformance(classId);
  }

  @Get('financial/revenue')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Relatório de Receita por Período' })
  @ApiQuery({ 
      name: 'startDate', 
      type: 'string', 
      description: 'Data de início (YYYY-MM-DD)', 
      example: '2025-01-01' 
  })
  @ApiQuery({ 
      name: 'endDate', 
      type: 'string', 
      description: 'Data de fim (YYYY-MM-DD)', 
      example: '2025-12-31' 
  })
  getFinancialReport(
      @Query('startDate') startDate: string, 
      @Query('endDate') endDate: string
  ) {
    return this.reportsService.getRevenueReport(startDate, endDate); 
  }

  @Get('financial/defaults')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Relatório de Inadimplência (Faturas vencidas)' })
  @ApiResponse({ status: 200, description: 'Lista de inadimplentes.' })
  getFinancialDefaults() {
    return this.reportsService.getDefaultsReport();
  }
}
