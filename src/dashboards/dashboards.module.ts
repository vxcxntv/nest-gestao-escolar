import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DashboardsService } from './dashboards.service';
import { DashboardsController } from './dashboards.controller';
import { User } from 'src/users/models/user.model';
import { Class } from 'src/classes/models/class.model';
import { Invoice } from 'src/invoices/models/invoice.model';
import { Grade } from 'src/grades/models/grade.model';
import { Attendance } from 'src/attendances/models/attendance.model';
import { Announcement } from 'src/announcements/models/announcement.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Class,
      Invoice,
      Grade,
      Attendance,
      Announcement,
    ]),
  ],
  controllers: [DashboardsController],
  providers: [DashboardsService],
  exports: [DashboardsService],
})
export class DashboardsModule {}
