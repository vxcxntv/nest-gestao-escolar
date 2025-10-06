import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { UserRole } from 'src/users/models/user.model';
import { CreateGradeDto } from './dto/create-grade.dto';
import { GradesService } from './grades.service';

@UseGuards(AuthGuard('jwt'), RolesGuard) // Protege todas as rotas deste controller
@Controller()
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  /**
   * Endpoint para um professor lançar uma nova nota.
   */
  @Roles(UserRole.TEACHER)
  @Post('grades')
  create(@Body() createGradeDto: CreateGradeDto, @Request() req) {
    // O ID do professor é extraído do payload do token JWT do usuário logado
    const teacherId = req.user.userId;
    return this.gradesService.create(createGradeDto, teacherId);
  }

  /**
   * Endpoint para consultar todas as notas de um aluno específico.
   * Acessível por Admins e Professores.
   */
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Get('students/:studentId/grades')
  findAllByStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return this.gradesService.findAllByStudent(studentId);
  }

  /**
   * Endpoint para o próprio aluno logado consultar suas notas.
   */
  @Roles(UserRole.STUDENT)
  @Get('my-grades')
  findMyGrades(@Request() req) {
    const studentId = req.user.userId;
    return this.gradesService.findAllByStudent(studentId);
  }
}
