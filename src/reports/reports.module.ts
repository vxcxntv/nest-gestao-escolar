import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { User } from 'src/users/models/user.model';
import { Class } from 'src/classes/models/class.model';
import { Grade } from 'src/grades/models/grade.model';
import { Attendance } from 'src/attendances/models/attendance.model';
import { Subject } from 'src/subjects/models/subject.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User, 
      Class, 
      Grade, 
      Attendance, 
      Subject
    ])
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService]
})
export class ReportsModule {}
