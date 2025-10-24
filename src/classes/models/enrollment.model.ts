import {
  Table, Column, Model, DataType, ForeignKey,
} from 'sequelize-typescript';
import { Class } from './class.model';
import { User } from 'src/users/models/user.model';

@Table({ tableName: 'enrollments', timestamps: true })
export class Enrollment extends Model {
  @ForeignKey(() => Class)
  @Column({ type: DataType.UUID })
  classId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  studentId: string;
}