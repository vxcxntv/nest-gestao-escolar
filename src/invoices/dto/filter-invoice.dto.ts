import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { InvoiceStatus } from '../models/invoice.model';

export class FilterInvoiceDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Filtrar por ID do aluno [cite: 745]',
  })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiProperty({
    required: false,
    description:
      'Filtrar por status da fatura (pending, paid, overdue, canceled) [cite: 559, 561]',
    enum: InvoiceStatus,
  })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @ApiProperty({
    required: false,
    description: 'Filtrar por data de vencimento a partir de... (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  dueDateFrom?: string;

  @ApiProperty({
    required: false,
    description: 'Filtrar por data de vencimento até... (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  dueDateTo?: string;

  @ApiProperty({
    required: false,
    description: 'Filtrar por ID do professor (para relatórios)',
  })
  @IsOptional()
  @IsUUID()
  teacherId?: string; // Filtro opcional para relatórios administrativos [cite: 749, 750]
}
