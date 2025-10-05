import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Class } from './models/class.model';
import { ClassSubject } from './models/class-subject.model';
import { Enrollment } from './models/enrollment.model';

@Module({
  imports: [SequelizeModule.forFeature([Class, ClassSubject, Enrollment])],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
