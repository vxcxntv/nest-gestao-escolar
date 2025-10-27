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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { UserRole } from 'src/users/models/user.model';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventDto } from './dto/filter-event.dto';

@ApiTags('Eventos do Calendário')
@ApiBearerAuth()
@Controller('events')
@UseGuards(RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles(UserRole.ADMIN) // Apenas administradores podem criar eventos
  @ApiOperation({ summary: 'Criar um novo evento no calendário escolar' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: 'Evento criado com sucesso.' })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado. Apenas administradores.',
  })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os eventos com filtros de período e tipo',
  })
  @ApiQuery({ type: FilterEventDto })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos retornada com sucesso.',
  })
  findAll(@Query() filterDto: FilterEventDto) {
    return this.eventsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um evento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do Evento' })
  @ApiResponse({ status: 200, description: 'Evento encontrado.' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar um evento existente' })
  @ApiParam({ name: 'id', description: 'ID do Evento' })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ status: 200, description: 'Evento atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover um evento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do Evento' })
  @ApiResponse({ 
    status: 200, 
    description: 'Evento removido com sucesso.',
    schema: {
      example: {
        message: "Evento 'Feriado de Natal' removido com sucesso."
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.remove(id);
  }
}
