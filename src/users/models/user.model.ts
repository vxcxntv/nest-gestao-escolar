import { Table, Column, Model, DataType, HasMany, HasOne } from 'sequelize-typescript';
import { Class } from 'src/classes/models/class.model';
import { BelongsToMany } from 'sequelize-typescript';
import { Enrollment } from 'src/classes/models/enrollment.model';
import { Grade } from '../../grades/models/grade.model';

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

  @Column({ 
    type: DataType.STRING, 
    allowNull: true, 
  })
  declare phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  declare matricula: string;

  @BelongsToMany(() => Class, () => Enrollment)
  declare enrolledClasses: Class[]; // ✅ Adicione DECLARE

  @HasMany(() => Class)
  declare classes: Class[]; // ✅ Adicione DECLARE

  @HasOne(() => Enrollment)
  enrollment: Enrollment;

  @HasMany(() => Grade)
  grades: Grade[];

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
