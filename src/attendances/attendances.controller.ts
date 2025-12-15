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
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { UserRole } from 'src/users/models/user.model';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@ApiTags('Frequência (Attendances)')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Registrar frequência de uma aula em lote (Batch)' })
  @ApiBody({
    type: CreateAttendanceDto,
    description: 'Dados da aula e lista de alunos presentes/ausentes.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Frequência registrada com sucesso.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado. Apenas professores.',
  })
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendancesService.createBatch(createAttendanceDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({
    summary: 'Listar registros de frequência com filtros e paginação',
  })
  @ApiQuery({
    type: FilterAttendanceDto,
    description: 'Filtros para data, turma e disciplina.',
  })
  @ApiResponse({
    status: 200,
    description: 'Registros de frequência retornados com sucesso.',
  })
  findAll(@Query() filterDto: FilterAttendanceDto) {
    return this.attendancesService.findAll(filterDto);
  }

  @Get('students/:studentId')
  @ApiOperation({ summary: 'Consultar o histórico de frequência de um aluno' })
  @ApiResponse({
    status: 200,
    description: 'Histórico de frequência do aluno retornado.',
  })
  findStudentHistory(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Request() req,
  ) {
    return this.attendancesService.findStudentHistory(studentId, req.user);
  }

  @Get('classes/:classId/summary')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({
    summary: 'Resumo de frequência de todos os alunos de uma turma',
  })
  @ApiParam({ name: 'classId', description: 'ID da turma' })
  @ApiResponse({
    status: 200,
    description: 'Resumo de frequência retornado com sucesso',
  })
  getClassAttendanceSummary(@Param('classId', ParseUUIDPipe) classId: string) {
    return this.attendancesService.getClassAttendanceSummary(classId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({
    summary: 'Atualizar/Corrigir um registro individual de frequência',
  })
  @ApiParam({ name: 'id', description: 'ID do registro de frequência' })
  @ApiBody({
    type: UpdateAttendanceDto,
    description: 'Dados para atualização do registro de frequência',
  })
  @ApiResponse({
    status: 200,
    description: 'Frequência atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Registro de frequência não encontrado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para editar esta frequência',
  })
  async update(
    @Param('id') id: number,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
    @Request() req,
  ) {
    return this.attendancesService.update(id, updateAttendanceDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Remover um registro individual de frequência' })
  @ApiParam({ name: 'id', description: 'ID do registro de frequência' })
  @ApiResponse({ 
    status: 200, 
    description: 'Frequência removida com sucesso',
    schema: {
      example: {
        message: 'Frequência removida com sucesso'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Registro de frequência não encontrado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para remover esta frequência',
  })
  async remove(@Param('id') id: number, @Request() req) {
    return this.attendancesService.remove(id, req.user);
  }
}
