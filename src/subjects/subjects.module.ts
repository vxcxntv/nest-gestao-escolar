// src/subjects/subjects.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { Subject } from './models/subject.model'; // Importe

@Module({
  imports: [SequelizeModule.forFeature([Subject])], // Registre
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}