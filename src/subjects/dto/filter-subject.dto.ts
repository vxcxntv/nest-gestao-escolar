import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto'; // Assumindo este caminho

export class FilterSubjectDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description:
      'Filtrar por nome da disciplina (busca parcial, case-insensitive).',
  })
  @IsOptional()
  @IsString()
  name?: string;

  // Poderia adicionar outros filtros aqui, se necessário.
}
