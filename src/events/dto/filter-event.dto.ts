import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto'; // Importa DTO base de paginação
import { EventType } from '../models/event.model';

export class FilterEventDto extends PaginationDto {
  @ApiProperty({
    description: 'Filtrar por título do evento (busca parcial)',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Filtrar por tipo de evento',
    enum: EventType,
    required: false,
  })
  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @ApiProperty({
    description: 'Data de início do período (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({
    description: 'Data de fim do período (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
