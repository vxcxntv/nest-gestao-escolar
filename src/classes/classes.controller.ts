import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Body, Param, Post } from '@nestjs/common'; // Adicione Post e Body


@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(+id, updateClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.remove(+id);
  }

  @Post(':classId/subjects')
  addSubjectToClass(
    @Param('classId') classId: string,
    @Body('subjectId') subjectId: string,
  ) {
  return this.classesService.addSubjectToClass(classId, subjectId);
  }

    // --- Endpoint para Matricular um Aluno ---
  @Post(':classId/students')
  @HttpCode(HttpStatus.NO_CONTENT)
  addStudentToClass(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Body('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.classesService.addStudentToClass(classId, studentId);
  }

  // --- Endpoint para Listar Alunos de uma Turma ---
  @Get(':classId/students')
  getStudentsFromClass(@Param('classId', ParseUUIDPipe) classId: string) {
    return this.classesService.getStudentsFromClass(classId);
  }
  
}
