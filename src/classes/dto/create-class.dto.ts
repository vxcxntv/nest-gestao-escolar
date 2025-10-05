import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  academic_year: number;

  @IsUUID()
  @IsNotEmpty()
  teacherId: string;
}
