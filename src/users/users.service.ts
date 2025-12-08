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
    @InjectModel(Enrollment)
    private enrollmentModel: typeof Enrollment, 
    @InjectModel(Class)
    private classModel: typeof Class,
  ) {}

  // Criação de usuário com hash de senha
  async create(createUserDto: CreateUserDto) {
    // 1. Cria o usuário
    const user = await this.userModel.create({
      ...createUserDto,
      password_hash: await bcrypt.hash(createUserDto.password || '123456', 10),
      // Mapeia o campo enrollment do front para a coluna matricula (se tiver renomeado)
      // matricula: createUserDto.enrollment 
    });

    // 2. Se veio o nome da turma, cria o vínculo na tabela enrollments
    if (createUserDto.class && user.role === 'student') {
      try {
        // Tenta achar a turma pelo nome exato enviado (ex: "1º Ano A")
        // DICA: No front, o ideal é enviar o ID da turma, mas vamos suportar nome por enquanto
        const classFound = await this.classModel.findOne({
            where: { name: { [Op.iLike]: createUserDto.class } }
        });

        if (classFound) {
            await this.enrollmentModel.create({
                studentId: user.id,
                classId: classFound.id
            });
        }
      } catch (e) {
          console.error("Erro ao vincular turma na criação", e);
          // Não falha a criação do usuário, apenas loga o erro de vínculo
      }
    }

    return user;
  }

  // findAll COM FILTROS E PAGINAÇÃO
  async findAll(filterDto: any) { // Use seu DTO de filtro aqui
    const { page = 1, limit = 10, name, email, role } = filterDto;
    const offset = (page - 1) * limit;
    const where: any = {};

    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (role) where.role = role;

    const { rows, count } = await this.userModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']], // Opcional: ordenar por mais recente
      attributes: { exclude: ['password_hash'] },
      distinct: true, // Importante para contagem correta com includes
      include: [
        {
          model: Enrollment,
          as: 'enrollment', // O mesmo 'as' definido no user.model.ts (@HasOne)
          required: false,  // LEFT JOIN (traz aluno mesmo sem turma)
          include: [
            {
              model: Class,
              as: 'class', // O mesmo 'as' definido no enrollment.model.ts (@BelongsTo)
              attributes: ['id', 'name', 'academic_year'] // Traz só o necessário
            }
          ]
        },
        {
          model: Grade,
          as: 'grades',
          required: false,
          include: [
             { model: Subject, as: 'subject', attributes: ['name'] }
          ]
        }
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
