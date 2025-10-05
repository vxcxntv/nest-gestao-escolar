// src/users/dto/filter-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../models/user.model';

// DTO base para paginação (pode estar em outro arquivo, ex: pagination.dto.ts)
export class PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Número da página (inicia em 1)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    required: false,
    description: 'Quantidade de itens por página',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}

export class FilterUserDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Filtrar usuários por nome (busca parcial, case-insensitive)',
    example: 'João',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Filtrar usuários por e-mail (busca parcial, case-insensitive)',
    example: 'joao@email.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    required: false,
    enum: UserRole,
    description: 'Filtrar usuários por função (role)',
    example: UserRole.ADMIN,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
