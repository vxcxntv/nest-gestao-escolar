// src/attendances/models/attendance.model.ts
import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Class } from 'src/classes/models/class.model';
import { Subject } from 'src/subjects/models/subject.model';
import { User } from 'src/users/models/user.model';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
}

@Table({ tableName: 'attendances', timestamps: true })
export class Attendance extends Model {
  @Column({
    type: DataType.DATEONLY, // Apenas a data, sem hora
    allowNull: false,
  })
  date: Date;

  @Column({
    type: DataType.ENUM(...Object.values(AttendanceStatus)),
    allowNull: false,
  })
  status: AttendanceStatus;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  studentId: string;

  @BelongsTo(() => User)
  student: User;

  @ForeignKey(() => Class)
  @Column({ type: DataType.UUID, allowNull: false })
  classId: string;

  @BelongsTo(() => Class)
  class: Class;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.UUID, allowNull: false })
  subjectId: string;

  @BelongsTo(() => Subject)
  subject: Subject;
}