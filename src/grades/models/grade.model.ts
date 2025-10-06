// src/grades/models/grade.model.ts
import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Subject } from 'src/subjects/models/subject.model';
import { User } from 'src/users/models/user.model';

@Table({ tableName: 'grades', timestamps: true })
export class Grade extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  value: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string; // Ex: "Prova Bimestral", "Trabalho de História"

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  studentId: string;

  @BelongsTo(() => User, 'studentId')
  student: User;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.UUID, allowNull: false })
  subjectId: string;

  @BelongsTo(() => Subject)
  subject: Subject;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  teacherId: string; // Professor que lançou a nota

  @BelongsTo(() => User, 'teacherId')
  teacher: User;
}