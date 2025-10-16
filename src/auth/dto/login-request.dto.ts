import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para a requisição de login (POST /auth/login)
 */
export class LoginRequestDto {
  @ApiProperty({ description: 'O e-mail do usuário para autenticação.', example: 'professor@escola.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'A senha do usuário.', example: 'minhasenha123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
