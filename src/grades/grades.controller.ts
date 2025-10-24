import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Request,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { UserRole } from 'src/users/models/user.model';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GradesService } from './grades.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Notas (Grades)')
@ApiBearerAuth() 
@UseGuards(AuthGuard('jwt'), RolesGuard) 
@Controller() /
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  
  @Roles(UserRole.TEACHER)
  @Post('grades')
  @ApiOperation({ summary: 'Lança uma nova nota para um aluno em uma disciplina.' })
  @ApiBody({ type: CreateGradeDto })
  @ApiResponse({ status: 201, description: 'Nota lançada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado. Apenas Professores.' })
  create(@Body() createGradeDto: CreateGradeDto, @Request() req) {
    const teacherId = req.user.userId;
    return this.gradesService.create(createGradeDto, teacherId);
  }

 
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.GUARDIAN)
  @Get('students/:studentId/grades')
  @ApiOperation({ summary: 'Lista todas as notas de um aluno. (Admin, Professor, Responsável)' })
  @ApiParam({
    name: 'studentId',
    description: 'ID do aluno para consulta de notas.',
  })
  @ApiResponse({ status: 200, description: 'Lista de notas retornada.' })
  findAllByStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return this.gradesService.findAllByStudent(studentId);
  }

 
  @Roles(UserRole.STUDENT)
  @Get('my-grades')
  @ApiOperation({ summary: 'Consulta as notas do próprio usuário logado.' })
  @ApiResponse({ status: 200, description: 'Lista de notas do aluno retornada.' })
  findMyGrades(@Request() req) {
    const studentId = req.user.userId;
    return this.gradesService.findAllByStudent(studentId);
  }

  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Patch('grades/:id')
  @ApiOperation({ summary: 'Atualiza uma nota existente (acesso: Admin e Professor).' })
  @ApiParam({ name: 'id', description: 'ID da nota a ser atualizada.' })
  @ApiBody({ type: UpdateGradeDto })
  @ApiResponse({ status: 200, description: 'Nota atualizada com sucesso.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGradeDto: UpdateGradeDto,
  ) {
    return this.gradesService.update(id, updateGradeDto);
  }

 
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Delete('grades/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma nota pelo ID (acesso: Admin e Professor).' })
  @ApiParam({ name: 'id', description: 'ID da nota a ser removida.' })
  @ApiResponse({ status: 204, description: 'Nota removida com sucesso.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.gradesService.remove(id);
  }
}
