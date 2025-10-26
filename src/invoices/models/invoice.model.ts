// src/invoices/models/invoice.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';

export enum InvoiceStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELED = 'canceled',
}

@Table({ tableName: 'invoices', timestamps: true })
export class Invoice extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  studentId: string;

  @BelongsTo(() => User)
  student: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  dueDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  paidAt: Date;

  @Column({
    type: DataType.ENUM(...Object.values(InvoiceStatus)),
    defaultValue: InvoiceStatus.PENDING,
    allowNull: false,
  })
  status: InvoiceStatus;
}
