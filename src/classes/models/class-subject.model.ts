import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Class } from './class.model';
import { Subject } from 'src/subjects/models/subject.model';

@Table({ tableName: 'class_subjects', timestamps: false })
export class ClassSubject extends Model {
  @ForeignKey(() => Class)
  @Column({ type: DataType.UUID })
  classId: string;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.UUID })
  subjectId: string;
}
