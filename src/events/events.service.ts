import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateEventDto } from './dto/create-event.dto';
import { FilterEventDto } from './dto/filter-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './models/event.model';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event)
    private eventModel: typeof Event,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    return this.eventModel.create(createEventDto as any);
  }

  async findAll(filterDto: FilterEventDto) {
    const { page = 1, limit = 10, title, type, dateFrom, dateTo } = filterDto;
    const where: any = {};

    if (title) {
      where.title = { [Op.iLike]: `%${title}%` };
    }
    if (type) {
      where.type = type;
    }

    if (dateFrom && dateTo) {
      where.date = { [Op.between]: [dateFrom, dateTo] };
    } else if (dateFrom) {
      where.date = { [Op.gte]: dateFrom };
    } else if (dateTo) {
      where.date = { [Op.lte]: dateTo };
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await this.eventModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['date', 'ASC']],
    });

    return {
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findByPk(id);
    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado.`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    return event.update(updateEventDto);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await event.destroy();
  }
}
