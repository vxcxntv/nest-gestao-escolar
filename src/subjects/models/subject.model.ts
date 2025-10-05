// src/subjects/models/subject.model.ts
import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { BelongsToMany } from 'sequelize-typescript'; // Importe
import { Class } from 'src/classes/models/class.model'; // Importe
import { ClassSubject } from 'src/classes/models/class-subject.model'; // Importe


@Table({ tableName: 'subjects', timestamps: true })
export class Subject extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

}

@BelongsToMany(() => Class, () => ClassSubject)
classes: Class[];