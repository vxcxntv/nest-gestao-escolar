import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
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
  declare value: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare studentId: string;

  @BelongsTo(() => User, 'studentId')
  declare student: User;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.UUID, allowNull: false })
  declare subjectId: string;

  @BelongsTo(() => Subject)
  declare subject: Subject;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare teacherId: string;

  @BelongsTo(() => User, 'teacherId')
  declare teacher: User;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
