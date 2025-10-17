import { Table, Column, Model, DataType } from 'sequelize-typescript';

// Tipos de Eventos para o calendário
export enum EventType {
  HOLIDAY = 'holiday',
  EXAM = 'exam',
  MEETING = 'meeting',
  REUNION = 'reunion', // Reunião
  OTHER = 'other',
}

@Table({ tableName: 'events', timestamps: true })
export class Event extends Model {
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
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.DATEONLY, // Apenas a data, sem hora
    allowNull: false,
  })
  date: Date;
  
  @Column({
    type: DataType.ENUM(...Object.values(EventType)),
    allowNull: false,
    defaultValue: EventType.OTHER,
  })
  type: EventType; // Tipo do evento (feriado, prova, etc.)
}
