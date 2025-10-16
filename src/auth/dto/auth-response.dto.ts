import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO para a resposta de sucesso do login (POST /auth/login)
 */
export class AuthResponseDto {
  @ApiProperty({ 
    description: 'Token de acesso JWT. Deve ser usado no header "Authorization: Bearer <token>" para acessar rotas protegidas.', 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGVzY29sYS5jb20iLCJzdWIiOiI2OTM1YzcyMi1jYjQ0LTQyOTAtYjAxYi0wY2E0NzkxMWU0NjUiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MTgyMzQ1NTEsImV4cCI6MTYxODMyMDk1MX0.fQzF5Lw5HqR1D8fK8zW4oWbF9x9L5Y7K9Y9g4f4'
  })
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  access_token: string;
}
