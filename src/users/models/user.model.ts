import { Table, Column, Model, DataType, HasMany, HasOne } from 'sequelize-typescript';
import { Class } from 'src/classes/models/class.model';
import { BelongsToMany } from 'sequelize-typescript';
import { Enrollment } from 'src/classes/models/enrollment.model';

export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  GUARDIAN = 'guardian',
}

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
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
  declare name: string; // ✅ Adicione DECLARE

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string; // ✅ Adicione DECLARE

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password_hash: string; // ✅ Adicione DECLARE

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
  })
  declare role: UserRole; // ✅ Adicione DECLARE

  @BelongsToMany(() => Class, () => Enrollment)
  declare enrolledClasses: Class[]; // ✅ Adicione DECLARE

  @HasMany(() => Class)
  declare classes: Class[]; // ✅ Adicione DECLARE

  @HasOne(() => Enrollment)
  enrollment: Enrollment;

  // Adicione os timestamps se necessário
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
