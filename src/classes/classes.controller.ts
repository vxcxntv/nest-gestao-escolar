import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { UserRole } from 'src/users/models/user.model';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { FilterClassDto } from './dto/filter-class.dto'; // Assumindo a criação futura de um filtro

@ApiTags('Classes')
@ApiBearerAuth('access-token')
@Controller('classes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar uma nova turma e associar um professor' })
  @ApiBody({ type: CreateClassDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Turma criada com sucesso.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Apenas administradores.' })
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as turmas (com filtros e paginação)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de turmas retornada.' })
  // Assumindo um FilterClassDto com paginação e filtros (similar ao FilterUserDto)
  @ApiQuery({
    type: FilterClassDto,
    description: 'Parâmetros opcionais para filtro e paginação.',
  })
  findAll(@Query() filterDto: FilterClassDto) {
    return this.classesService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma turma pelo ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Turma encontrada.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Turma não encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar dados de uma turma' })
  @ApiBody({ type: UpdateClassDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Turma atualizada com sucesso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Turma não encontrada.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover uma turma' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Turma removida com sucesso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Turma não encontrada.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.remove(id);
  }

  @Post(':classId/subjects')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Associa uma disciplina a uma turma' })
  @ApiBody({ schema: { properties: { subjectId: { type: 'string', format: 'uuid', example: 'd1e2f3g4-h5i6-7890-abcd-ef0123456789' } } } })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Disciplina associada com sucesso.' })
  addSubjectToClass(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Body('subjectId', ParseUUIDPipe) subjectId: string,
  ) {
    return this.classesService.addSubjectToClass(classId, subjectId);
  }

@Delete(':classId/subjects/:subjectId')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desassocia uma disciplina da turma' })
  @ApiResponse({ status: 204, description: 'Disciplina desassociada com sucesso.' })
  removeSubjectFromClass(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Param('subjectId', ParseUUIDPipe) subjectId: string,
  ) {
    return this.classesService.removeSubjectFromClass(classId, subjectId);
  }

  @Post(':classId/students')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Matricular um aluno em uma turma' })
  @ApiBody({ schema: { properties: { studentId: { type: 'string', format: 'uuid', example: '12345678-abcd-ef01-2345-67890abcdef0' } } } })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Aluno matriculado com sucesso.' })
  addStudentToClass(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Body('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.classesService.addStudentToClass(classId, studentId);
  }

  @Delete(':classId/students/:studentId')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desmatricula um aluno de uma turma' })
  @ApiResponse({ status: 204, description: 'Aluno desmatriculado com sucesso.' })
  removeStudentFromClass(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.classesService.removeStudentFromClass(classId, studentId);
  }
  
  @Get(':classId/students')
  @ApiOperation({ summary: 'Lista todos os alunos matriculados em uma turma' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de alunos da turma retornada.' })
  getStudentsFromClass(@Param('classId', ParseUUIDPipe) classId: string) {
    return this.classesService.getStudentsFromClass(classId);
  }
}
