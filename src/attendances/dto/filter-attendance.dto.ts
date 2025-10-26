import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsDateString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto'; // DTO de paginação base

export class FilterAttendanceDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Filtrar por ID de uma Turma específica.',
  })
  @IsOptional()
  @IsUUID()
  classId?: string;

  @ApiProperty({
    required: false,
    description: 'Filtrar por ID de uma Disciplina específica.',
  })
  @IsOptional()
  @IsUUID()
  subjectId?: string;

  @ApiProperty({
    required: false,
    description: 'Filtrar por ID de um Aluno específico.',
  })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiProperty({
    required: false,
    description: 'Filtrar registros a partir de uma data (YYYY-MM-DD).',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;
}
