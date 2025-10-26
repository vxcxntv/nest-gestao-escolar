import { BelongsToMany } from 'sequelize-typescript';
import { Subject } from 'src/subjects/models/subject.model';
import { ClassSubject } from './class-subject.model';
import { User } from 'src/users/models/user.model';
import { Enrollment } from './enrollment.model';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

@Table({ tableName: 'classes', timestamps: true })
export class Class extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare academic_year: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare teacherId: string;

  @BelongsTo(() => User, 'teacherId')
  declare teacher: User;

  @BelongsToMany(() => Subject, () => ClassSubject)
  declare subjects: Subject[];

  @BelongsToMany(() => User, () => Enrollment, 'classId', 'studentId')
  declare students: User[];

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
