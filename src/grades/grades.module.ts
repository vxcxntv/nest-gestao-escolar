import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { Grade } from './models/grade.model';

@Module({
  imports: [SequelizeModule.forFeature([Grade])],
  controllers: [GradesController],
  providers: [GradesService],
})
export class GradesModule {}
