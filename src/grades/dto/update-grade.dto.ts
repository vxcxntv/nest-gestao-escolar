import { PartialType } from '@nestjs/mapped-types';
import { CreateGradeDto } from './create-grade.dto';

// Para atualizações, permitimos que os campos sejam enviados parcialmente.
export class UpdateGradeDto extends PartialType(CreateGradeDto) {}