import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateBatchInvoiceDto {
  @ApiProperty({
    description: 'ID da turma para a qual as faturas serão geradas em lote.',
    example: 'f1e2d3c4-b5a6-9870-6543-210987fedcba',
  })
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @ApiProperty({
    description:
      'Descrição base para as faturas. Será aplicada a todos os alunos da turma.',
    example: 'Mensalidade de Novembro/2025',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Valor a ser cobrado de cada aluno.',
    example: 800.0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Data de vencimento para todas as faturas geradas.',
    example: '2025-11-10',
  })
  @IsDateString()
  dueDate: Date;
}
