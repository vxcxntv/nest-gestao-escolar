import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateGradeDto {
  @IsNumber()
  @Min(0)
  @Max(10) // Supondo um sistema de notas de 0 a 10
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsUUID()
  @IsNotEmpty()
  subjectId: string;
}
