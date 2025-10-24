import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 
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
    example: 'senhaSegura123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Papel/permissão do usuário no sistema',
    enum: UserRole, // Mostra os valores permitidos
    example: UserRole.STUDENT,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
