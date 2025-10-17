import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { Attendance } from './models/attendance.model';
import { Class } from 'src/classes/models/class.model';
import { User } from 'src/users/models/user.model';
import { Subject } from 'src/subjects/models/subject.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Attendance,
      Class,
      User,
      Subject
    ])
  ],
  controllers: [AttendancesController],
  providers: [AttendancesService],
  exports: [AttendancesService]
})
export class AttendancesModule {}
