import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Enrollment } from 'src/classes/models/enrollment.model';
import { Class } from 'src/classes/models/class.model';
import { Grade } from 'src/grades/models/grade.model';
import { Subject } from 'src/subjects/models/subject.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // Criação de usuário com hash de senha
  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const userToCreate = {
      ...createUserDto,
      password_hash: hashedPassword,
    };

    delete (userToCreate as any).password;

    const createdUser = await this.userModel.create(userToCreate);
    const { password_hash, ...result } = createdUser.get({ plain: true });
    return result as User;
  }

  // findAll COM FILTROS E PAGINAÇÃO
  async findAll(filterDto: FilterUserDto) {
    const { page = 1, limit = 10, name, email, role } = filterDto;

    const where: any = {};

    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }
    if (email) {
      where.email = { [Op.iLike]: `%${email}%` };
    }
    if (role) {
      where.role = role;
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await this.userModel.findAndCountAll({
      where,
      limit,
      offset,
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Enrollment, // Nome da classe do model de Matrícula
          as: 'enrollment',  // O alias definido no 'User.hasOne(Enrollment)'
          required: false,   // false = LEFT JOIN (traz o user mesmo sem matrícula)
          include: [
            {
              model: Class, // Nome da classe do model de Turma
              as: 'class',  // O alias definido no 'Enrollment.belongsTo(Class)'
            }
          ]
        },
        
      ]
    });

    return {
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  // Buscar um usuário pelo ID (sem retornar o hash da senha)
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return user;
  }

  // Buscar um usuário pelo email (usado pelo AuthService)
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado.`);
    }

    return user;
  }

  // Método específico para autenticação (COM password_hash)
  async findForAuth(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { email },
      // Não exclui o password_hash - necessário para validação
    });

    console.log('🔐 Buscando usuário para auth:', { 
      email, 
      userFound: !!user,
      hasPasswordHash: user?.password_hash ? 'SIM' : 'NÃO' 
    });

    return user;
  }

  // Atualizar usuário
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(updateUserDto.password, salt);

      const [affected, [updatedUser]] = await this.userModel.update(
        { ...updateUserDto, password_hash: hashedPassword },
        {
          where: { id },
          returning: true,
        },
      );

      if (affected === 0) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
      }

      const { password_hash, ...result } = updatedUser.get({ plain: true });
      return result as User;
    } else {
      const [affected, [updatedUser]] = await this.userModel.update(
        updateUserDto,
        {
          where: { id },
          returning: true,
        },
      );

      if (affected === 0) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
      }

      const { password_hash, ...result } = updatedUser.get({ plain: true });
      return result as User;
    }
  }

  // Remover usuário
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }

  // Alterar senha do usuário logado
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password_hash,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    if (
      changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword
    ) {
      throw new BadRequestException(
        'A nova senha e a confirmação não coincidem',
      );
    }

    const salt = await bcrypt.genSalt();
    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      salt,
    );

    await user.update({ password_hash: hashedNewPassword });

    return { message: 'Senha alterada com sucesso' };
  }

  async count(): Promise<number> {
    return this.userModel.count();
  }
}
