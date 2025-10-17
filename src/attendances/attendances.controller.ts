import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { UserRole } from 'src/users/models/user.model';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';

@ApiTags('Frequência (Attendances)')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  @Roles(UserRole.TEACHER)
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content em caso de sucesso
  @ApiOperation({ summary: 'Registrar frequência de uma aula em lote (Batch)' })
  @ApiBody({ type: CreateAttendanceDto, description: 'Dados da aula e lista de alunos presentes/ausentes.' })
  @ApiResponse({ status: 204, description: 'Frequência registrada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado. Apenas professores.' })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendancesService.createBatch(createAttendanceDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Listar registros de frequência com filtros e paginação' })
  @ApiQuery({ type: FilterAttendanceDto, description: 'Filtros para data, turma e disciplina.' })
  @ApiResponse({ status: 200, description: 'Registros de frequência retornados com sucesso.' })
  findAll(@Query() filterDto: FilterAttendanceDto) {
    // Nota: O service precisa aceitar o filterDto
    return this.attendancesService.findAll(filterDto);
  }
  
  @Get('students/:studentId')
  @ApiOperation({ summary: 'Consultar o histórico de frequência de um aluno' })
  @ApiResponse({ status: 200, description: 'Histórico de frequência do aluno retornado.' })
  // O service fará a validação se é Admin, Professor ou o próprio aluno/responsável
  findStudentHistory(@Param('studentId', ParseUUIDPipe) studentId: string, @Request() req) {
      // O service deve lidar com a lógica de permissão interna
      return this.attendancesService.findStudentHistory(studentId, req.user);
  }
  
  // NOTE: Faltam os endpoints PATCH e DELETE para edição de um registro individual
}
