import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

// Este DTO é usado para filtrar relatórios financeiros por período.
export class FilterFinancialReportDto {
  @ApiProperty({
    description: 'Data de início para o cálculo do relatório (YYYY-MM-DD).',
    example: '2025-01-01',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'Data de fim para o cálculo do relatório (YYYY-MM-DD).',
    example: '2025-12-31',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}
