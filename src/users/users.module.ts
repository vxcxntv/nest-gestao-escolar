import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './models/user.model';
import { Enrollment } from '../classes/models/enrollment.model';
import { Class } from '../classes/models/class.model';
import { Grade } from '../grades/models/grade.model';
import { Attendance } from 'src/attendances/models/attendance.model';
import { Invoice } from 'src/invoices/models/invoice.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Enrollment, Class, Grade, Attendance, Invoice]) 
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, SequelizeModule] // Exporta se outros módulos precisarem
})
export class UsersModule {}
