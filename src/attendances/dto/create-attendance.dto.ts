import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../models/attendance.model';

// DTO para os dados de um único aluno na lista de presença
class StudentAttendanceDto {
  @ApiProperty({ description: 'ID do aluno.' })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Status da frequência.',
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
  })
  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;

  @ApiProperty({
    description: 'Observações sobre a presença (ex: Atrasado, Saiu mais cedo).',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

}

// DTO principal para a requisição em lote
export class CreateAttendanceDto {
  @ApiProperty({
    description: 'Data da aula no formato YYYY-MM-DD.',
    example: '2025-10-16',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'ID da Turma (Class) à qual o registro pertence.',
  })
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @ApiProperty({ description: 'ID da Disciplina (Subject) da aula.' })
  @IsUUID()
  @IsNotEmpty()
  subjectId: string;

  @ApiProperty({
    description: 'Lista de presença/falta dos alunos.',
    type: [StudentAttendanceDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAttendanceDto)
  presences: StudentAttendanceDto[];
}