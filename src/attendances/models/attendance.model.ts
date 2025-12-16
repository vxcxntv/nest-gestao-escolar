import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Class } from 'src/classes/models/class.model';
import { Subject } from 'src/subjects/models/subject.model';
import { User } from 'src/users/models/user.model';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',       // Adicionado para suportar o status 'late' do frontend
  EXCUSED = 'excused'  // Adicionado para suportar 'excused'
}

@Table({ tableName: 'attendances', timestamps: true })
export class Attendance extends Model {
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare date: Date;

  @Column({
    type: DataType.ENUM(...Object.values(AttendanceStatus)),
    allowNull: false,
  })
  declare status: AttendanceStatus;


  @Column({
    type: DataType.TEXT,
    allowNull: true, // Opcional
  })
  declare notes: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare studentId: string;

  @BelongsTo(() => User)
  declare student: User;

  @ForeignKey(() => Class)
  @Column({ type: DataType.UUID, allowNull: false })
  declare classId: string;

  @BelongsTo(() => Class)
  declare class: Class;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.UUID, allowNull: false })
  declare subjectId: string;

  @BelongsTo(() => Subject)
  declare subject: Subject;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}