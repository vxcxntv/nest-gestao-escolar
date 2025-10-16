import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
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
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { UserRole } from 'src/users/models/user.model';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { FilterSubjectDto } from './dto/filter-subject.dto';

@ApiTags('Disciplinas')
@ApiBearerAuth()
@Controller('subjects')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar uma nova disciplina' })
  @ApiBody({ type: CreateSubjectDto, description: 'Dados para a criação da disciplina.' })
  @ApiResponse({ status: 201, description: 'Disciplina criada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado. Apenas administradores.' })
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as disciplinas com filtros e paginação' })
  @ApiQuery({ type: FilterSubjectDto, description: 'Filtros opcionais para nome e paginação.' })
  @ApiResponse({ status: 200, description: 'Lista de disciplinas retornada com sucesso.' })
  findAll(@Query() filterDto: FilterSubjectDto) {
    // Nota: O serviço precisa ser atualizado para aceitar o filterDto
    return this.subjectsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma disciplina pelo ID' })
  @ApiResponse({ status: 200, description: 'Disciplina encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Disciplina não encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar dados de uma disciplina existente' })
  @ApiBody({ type: UpdateSubjectDto, description: 'Dados a serem atualizados (opcional).' })
  @ApiResponse({ status: 200, description: 'Disciplina atualizada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado. Apenas administradores.' })
  @ApiResponse({ status: 404, description: 'Disciplina não encontrada.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma disciplina pelo ID' })
  @ApiResponse({ status: 204, description: 'Disciplina removida com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado. Apenas administradores.' })
  @ApiResponse({ status: 404, description: 'Disciplina não encontrada.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectsService.remove(id);
  }
}
