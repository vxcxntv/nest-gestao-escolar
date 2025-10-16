import { PartialType } from '@nestjs/mapped-types';
import { CreateGradeDto } from './create-grade.dto';
import { ApiProperty } from '@nestjs/swagger';

// Para atualizações, permitimos que os campos sejam enviados parcialmente.
export class UpdateGradeDto extends PartialType(CreateGradeDto) {}
