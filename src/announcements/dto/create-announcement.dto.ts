// src/announcements/dto/create-announcement.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAnnouncementDto {
  @ApiProperty({ 
    description: 'Título do aviso',
    example: 'Reunião de Pais'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    description: 'Conteúdo do aviso',
    example: 'Há uma reunião de pais marcada para próxima sexta-feira...'
  })
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
