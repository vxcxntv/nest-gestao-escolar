import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({
    description: 'Nome da disciplina.',
    example: 'Matemática Aplicada',
  })
  @IsString()
  @IsNotEmpty()
  name: string;


  @ApiProperty({
    description: 'Carga horária / Créditos.',
    example: 60,
  })
  @IsInt()
  @IsNotEmpty()
  credits: number;

  @ApiProperty({
    description: 'Ano da grade curricular.',
    example: 2025,
  })
  @IsInt()
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    description: 'Descrição detalhada.',
    example: 'Estudo de cálculo diferencial e integral.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}