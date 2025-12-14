import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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
    description: 'Categoria do aviso',
    example: 'general',
    enum: ['general', 'event', 'urgent', 'academic'],
    required: false
  })
  @IsOptional()
  @IsEnum(['general', 'event', 'urgent', 'academic'])
  category?: string;

  @ApiProperty({
    description: 'Define se o aviso deve ficar fixado no topo',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  pinned?: boolean;

  @ApiProperty({
    description: 'ID da turma (opcional). Se não for fornecido, o aviso é geral.',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  classId?: string;
}