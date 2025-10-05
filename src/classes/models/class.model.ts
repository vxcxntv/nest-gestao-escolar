// src/classes/models/class.model.ts
import { BelongsToMany } from 'sequelize-typescript'; // Importe
import { Subject } from 'src/subjects/models/subject.model'; // Importe
import { ClassSubject } from './class-subject.model'; // Importe
import { BelongsToMany } from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { Enrollment } from './enrollment.model';

import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model'; // Importe o modelo User

@Table({ tableName: 'classes', timestamps: true })
export class Class extends Model {
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
  name: string; // Ex: "Turma 301 - Tarde"

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  academic_year: number; // Ex: 2025

  // --- RELACIONAMENTO: Uma Turma pertence a um Professor (User) ---
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  teacherId: string;

  @BelongsTo(() => User)
  teacher: User;

    @BelongsToMany(() => Subject, () => ClassSubject)
    subjects: Subject[];

    @BelongsToMany(() => User, () => Enrollment)
    students: User[];
}