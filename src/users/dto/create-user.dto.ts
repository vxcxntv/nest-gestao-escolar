import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../models/user.model';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Endereço de e-mail único do usuário',
    example: 'joao.silva@escola.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Senha (será hasheada antes de ser salva)',
    example: 'SenhaSegura123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número',
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Papel/permissão do usuário no sistema (opcional para registro público)',
    enum: UserRole,
    example: UserRole.STUDENT,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Telefone de contato do usuário (opcional)',
    example: '+55 (11) 91234-5678',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[\d+\-()\s]{7,20}$/, {
    message: 'Telefone inválido',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Matrícula ou número de registro do usuário (opcional)',
    example: '20250001',
  })
  @IsOptional()
  @IsString()
  matricula?: string;

  @ApiPropertyOptional({
    description: 'Matrícula do enrollment associada ao usuário (opcional)',
    example: 'enrollment-uuid-1234',
  })
  @IsString()
  @IsOptional()
  enrollment?: string; // Aceita enrollment se o front mandar

  @ApiPropertyOptional({
    description: 'Turma à qual o usuário será associado (opcional)',
    example: 'Turma A - 2024',
  })
  @IsString()
  @IsOptional()
  class?: string; // Aceita o nome/ID da turma
}
