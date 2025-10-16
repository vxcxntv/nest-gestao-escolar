import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';

// Este DTO herda page e limit do PaginationDto
export class FilterClassDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Filtrar turmas pelo nome (busca parcial)',
    example: 'História',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Filtrar turmas pelo ID do professor responsável (UUID)',
  })
  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @ApiProperty({
    required: false,
    description: 'Filtrar turmas pelo ano letivo (ex: 2025)',
    example: 2024,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Garante que o valor da query string seja convertido para número
  academic_year?: number;
}
