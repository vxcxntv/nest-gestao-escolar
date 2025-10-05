import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AttendanceStatus } from '../models/attendance.model';

// DTO para os dados de um único aluno na lista de presença
class StudentAttendanceDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;
}

// DTO principal para a requisição em lote
export class CreateAttendanceDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsUUID()
  @IsNotEmpty()
  subjectId: string;

  @IsArray()
  @ValidateNested({ each: true }) // Valida cada objeto dentro do array
  @Type(() => StudentAttendanceDto) // Necessário para o ValidateNested funcionar
  presences: StudentAttendanceDto[];
}
