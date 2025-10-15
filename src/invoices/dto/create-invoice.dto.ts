import {ApiProperty} from '@nestjs/swagger';
import {IsDateString, IsNotEmpty, IsNumber, IsString, IsUUID, Min,} from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({
    description:
      'ID do aluno (usuário com papel de estudante) para quem a fatura será gerada.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Descrição da fatura, que aparecerá para o usuário.',
    example: 'Mensalidade de Novembro/2025',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Valor monetário da fatura.', example: 750.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Data de vencimento no formato YYYY-MM-DD.',
    example: '2025-11-10',
  })
  @IsDateString()
  dueDate: Date;
}