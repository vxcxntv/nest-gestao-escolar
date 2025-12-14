import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Class } from 'src/classes/models/class.model';
import { User } from 'src/users/models/user.model';

@Table({ tableName: 'announcements', timestamps: true })
export class Announcement extends Model {
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
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare content: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'general', // Valor padrão caso não seja enviado
    allowNull: false,
  })
  declare category: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  declare pinned: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare authorId: string;

  @BelongsTo(() => User)
  declare author: User;

  @ForeignKey(() => Class)
  @Column({ type: DataType.UUID, allowNull: true })
  declare classId: string;

  @BelongsTo(() => Class)
  declare class: Class;
}