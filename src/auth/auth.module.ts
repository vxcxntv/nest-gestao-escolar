// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module'; // Precisamos do serviço de usuários
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule, // Importa para que possamos injetar o UsersService
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SUPER_SECRET_KEY_32_CHARS_LONG', // Use uma variável de ambiente!
      signOptions: { expiresIn: '1d' }, // Token expira em 1 dia
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Registra nosso serviço e a estratégia JWT
})
export class AuthModule {}