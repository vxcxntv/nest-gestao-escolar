import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EventType } from '../models/event.model';

export class CreateEventDto {
  @ApiProperty({ description: 'Título breve do evento', example: 'Feriado de Natal' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Descrição detalhada do evento', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Data do evento (formato YYYY-MM-DD)', example: '2025-12-25' })
  @IsDateString()
  @IsNotEmpty()
  date: string; // Usamos string para validação do formato DATEONLY

  @ApiProperty({ description: 'Tipo do evento', enum: EventType, example: EventType.HOLIDAY })
  @IsEnum(EventType)
  @IsNotEmpty()
  type: EventType;
}
