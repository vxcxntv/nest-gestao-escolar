// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './models/user.model'; // Importe o modelo

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    // Se UsersModule depender de outro módulo, use forwardRef aqui também
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, SequelizeModule],
})
export class UsersModule {}