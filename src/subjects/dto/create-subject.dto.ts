import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({
    description: 'Nome da disciplina (deve ser único).',
    example: 'Matemática Aplicada',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descrição detalhada da ementa ou conteúdo da disciplina.',
    example: 'Estudo de cálculo diferencial e integral.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
