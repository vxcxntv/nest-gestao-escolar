import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { Subject } from './models/subject.model';

@Module({
  imports: [SequelizeModule.forFeature([Subject])],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
