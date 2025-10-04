// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Criptografa a senha antes de salvar
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const userToCreate = {
      ...createUserDto,
      password_hash: hashedPassword,
    };

    // Remove a senha do DTO para segurança
    delete userToCreate.password;

    const createdUser = await this.userModel.create(userToCreate);

    // Remove o hash da senha da resposta
    const { password_hash, ...result } = createdUser.get({ plain: true });
    return result as User;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
        attributes: { exclude: ['password_hash'] } // Exclui o hash da lista
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id, {
        attributes: { exclude: ['password_hash'] }
    });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return user;
  }

  // Implemente update() e remove() de forma similar...
}