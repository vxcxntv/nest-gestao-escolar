import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FilterAnnouncementDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Filtrar avisos pelo título (busca parcial, case-insensitive)',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    required: false,
    description: 'Filtrar avisos por um ID de turma específico',
  })
  @IsOptional()
  @IsUUID()
  classId?: string;

  @ApiProperty({
    required: false,
    description: 'Filtrar avisos por prioridade',
    enum: ['low', 'medium', 'high']
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: string;

  @ApiProperty({
    required: false,
    description: 'Filtrar avisos por público-alvo',
    example: 'students'
  })
  @IsOptional()
  @IsString()
  targetAudience?: string;
}
