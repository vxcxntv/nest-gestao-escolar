// src/announcements/dto/create-announcement.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAnnouncementDto {
  @ApiProperty({ description: 'Título do aviso' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Conteúdo do aviso' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'ID da turma (opcional). Se não for fornecido, o aviso é geral.',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  classId?: string;
}