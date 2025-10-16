import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGradeDto {
  @ApiProperty({
    description: 'Valor da nota (entre 0 e 10)',
    minimum: 0,
    maximum: 10,
    example: 8.5,
  })
  @IsNumber()
  @Min(0)
  @Max(10) // Supondo um sistema de notas de 0 a 10
  @IsNotEmpty()
  value: number;

  @ApiProperty({
    description: 'Descrição da avaliação (Ex: Prova Bimestral, Trabalho em Grupo)',
    example: 'Exame Final 1º Semestre',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'ID do aluno que recebeu a nota',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'ID da disciplina relacionada à nota',
    example: 'd4c3b2a1-f6e5-8b7a-0d9c-f3e2d1c0b9a8',
  })
  @IsUUID()
  @IsNotEmpty()
  subjectId: string;
}
