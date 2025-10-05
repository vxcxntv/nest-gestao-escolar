import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { Attendance } from './models/attendance.model';

@Module({
  imports: [SequelizeModule.forFeature([Attendance])],
  controllers: [AttendancesController],
  providers: [AttendancesService],
})
export class AttendancesModule {}

