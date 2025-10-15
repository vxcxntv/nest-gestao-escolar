import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo,
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
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  // Quem publicou o aviso
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  authorId: string;

  @BelongsTo(() => User)
  author: User;

  // Para qual turma o aviso se destina (opcional)
  // Se for nulo, é um aviso geral para todos.
  @ForeignKey(() => Class)
  @Column({ type: DataType.UUID, allowNull: true })
  classId: string;

  @BelongsTo(() => Class)
  class: Class;
}