import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
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
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password_hash: string; // Nunca armazene a senha em texto plano!

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
  })
  role: UserRole;

  @BelongsToMany(() => Class, () => Enrollment)
  enrolledClasses: Class[];

  @HasMany(() => Class)
  classes: Class[];
}
