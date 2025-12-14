import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { BelongsToMany } from 'sequelize-typescript';
import { Class } from 'src/classes/models/class.model';
import { ClassSubject } from 'src/classes/models/class-subject.model';

@Table({ tableName: 'subjects', timestamps: true })
export class Subject extends Model {
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
    unique: true, // O código da disciplina deve ser único (ex: MAT101)
  })
  code: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  credits: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  year: number; // Representa o Ano da Grade (ex: 2025)
  

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @BelongsToMany(() => Class, () => ClassSubject)
  classes: Class[];
}