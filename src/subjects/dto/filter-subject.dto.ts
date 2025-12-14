import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FilterSubjectDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Filtrar por nome ou código (busca parcial).',
  })
  @IsOptional()
  @IsString()
  name?: string; // Usamos 'name' para buscar tanto por nome quanto código no service

  @ApiProperty({
    required: false,
    description: 'Filtrar por ano da grade.',
  })
  @IsOptional()
  @Type(() => Number) // Garante conversão de query string para number
  @IsInt()
  year?: number;
}