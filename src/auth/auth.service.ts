import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserRole } from '../users/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      console.log('🔐 AuthService - Buscando usuário:', email);
      
      const user = await this.usersService.findOneByEmail(email);
      console.log('🔐 AuthService - Usuário encontrado:', user ? user.email : 'NÃO ENCONTRADO');
      
      if (user) {
        console.log('🔐 AuthService - Hash no banco:', user.password_hash);
        console.log('🔐 AuthService - Senha para comparar:', password);
        
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        console.log('🔐 AuthService - Bcrypt compare result:', isPasswordValid);
        
        if (isPasswordValid) {
          const { password_hash, ...result } = user.get({ plain: true });
          console.log('✅ AuthService - Senha válida');
          return result;
        } else {
          console.log('❌ AuthService - Senha inválida');
        }
      }
      
      return null;
    } catch (error) {
      console.log('❌ AuthService - Erro:', error);
      return null;
    }
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const userCount = await this.usersService.count();
    if (userCount > 0) {
      throw new BadRequestException('Registro público apenas para o primeiro usuário');
    }
    createUserDto.role = UserRole.ADMIN;
    const user = await this.usersService.create(createUserDto);
    return this.login(user);
  }
}