// src/announcements/announcements.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Class } from 'src/classes/models/class.model';
import { UserRole } from 'src/users/models/user.model';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { FilterAnnouncementDto } from './dto/filter-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Announcement } from './models/announcement.model';
import { User } from 'src/users/models/user.model';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectModel(Announcement)
    private announcementModel: typeof Announcement,
  ) {}

  async create(
    createAnnouncementDto: CreateAnnouncementDto,
    authorId: string,
  ): Promise<Announcement> {
    const announcement = await this.announcementModel.create({
      ...createAnnouncementDto,
      authorId,
    });
    
    return this.findOne(announcement.id);
  }

  async findAll(filterDto: FilterAnnouncementDto, user: any) {
    const { page = 1, limit = 10, title, classId } = filterDto;
    const where: any = {};

    if (title) {
      where.title = { [Op.iLike]: `%${title}%` };
    }
    if (classId) {
      where.classId = classId;
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await this.announcementModel.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        { model: User, as: 'author', attributes: ['id', 'name'] },
        { model: Class, as: 'class' },
      ],
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: string): Promise<Announcement> {
    const announcement = await this.announcementModel.findByPk(id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
        { model: Class, as: 'class' },
      ],
    });
    
    if (!announcement) {
      throw new NotFoundException(`Aviso com ID ${id} não encontrado.`);
    }
    
    return announcement;
  }

  async update(
    id: string,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    const announcement = await this.findOne(id);
    await announcement.update(updateAnnouncementDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const announcement = await this.findOne(id);
    await announcement.destroy();
    
    return { message: 'Aviso removido com sucesso' };
  }
}
