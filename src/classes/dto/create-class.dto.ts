import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateClassDto {
  @ApiProperty({
    description: 'Nome da turma (ex: "3º Ano A - Tarde")',
    example: 'Matemática 201',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Ano letivo ao qual a turma pertence (ex: 2025)',
    example: 2025,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  academic_year: number;

  @ApiProperty({
    description: 'ID do professor responsável pela turma (UUID)',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  teacherId: string;
}
