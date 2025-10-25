import { Injectable, UnauthorizedException } from '@nestjs/common';
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
      const user = await this.usersService.findOneByEmail(email);
      
      if (user && await bcrypt.compare(password, user.password_hash)) {
        const { password_hash, ...result } = user.get({ plain: true });
        return result;
      }
      return null;
    } catch (error) {
      // Se o usuário não for encontrado, retorna null
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
