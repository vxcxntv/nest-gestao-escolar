import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectDto } from './create-subject.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para atualização de disciplina.
 * Torna todos os campos de CreateSubjectDto opcionais.
 */
export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {}
