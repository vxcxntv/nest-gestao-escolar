// src/announcements/announcements.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { UserRole } from 'src/users/models/user.model';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { FilterAnnouncementDto } from './dto/filter-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@ApiTags('Avisos')
@ApiBearerAuth()
@Controller('announcements')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Cria um novo aviso' })
  @ApiResponse({ status: 201, description: 'O aviso foi criado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  create(@Body() createAnnouncementDto: CreateAnnouncementDto, @Request() req) {
    const authorId = req.user.userId;
    return this.announcementsService.create(createAnnouncementDto, authorId);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os avisos com filtros e paginação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de avisos retornada com sucesso.',
  })
  findAll(@Query() filterDto: FilterAnnouncementDto, @Request() req) {
    return this.announcementsService.findAll(filterDto, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um aviso por ID' })
  @ApiResponse({ status: 200, description: 'Aviso retornado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Aviso não encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.announcementsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Atualiza um aviso' })
  @ApiResponse({ status: 200, description: 'Aviso atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Aviso não encontrado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return this.announcementsService.update(id, updateAnnouncementDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @HttpCode(HttpStatus.OK) // Mude para 200 para retornar a mensagem
  @ApiOperation({ summary: 'Remove um aviso' })
  @ApiResponse({ 
    status: 200, 
    description: 'Aviso removido com sucesso.',
    schema: {
      example: {
        message: 'Aviso removido com sucesso'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Aviso não encontrado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.announcementsService.remove(id);
  }
}
