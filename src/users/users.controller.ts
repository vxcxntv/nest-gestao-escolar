import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody, 
  ApiQuery, 
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { UserRole } from './models/user.model';

@ApiTags('Usuários') 
@ApiBearerAuth('access-token') 
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar um novo usuário (Admin apenas)' })
  @ApiBody({
    type: CreateUserDto, 
    description: 'Dados necessários para o cadastro de um novo usuário.',
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado. Apenas administradores.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados de entrada inválidos.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar todos os usuários com filtros e paginação' })
  @ApiQuery({
    type: FilterUserDto, 
    description: 'Parâmetros de filtro e paginação.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de usuários retornada com sucesso.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado. Apenas administradores.' })
  findAll(@Query() filterUserDto: FilterUserDto) {
    return this.usersService.findAll(filterUserDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Obter informações do usuário logado' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Dados do usuário retornados com sucesso.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Token JWT inválido ou ausente.' })
  getProfile(@Request() req) {
    // Note: req.user.userId é injetado pelo JwtStrategy
    return this.usersService.findOne(req.user.userId);
  }

  @Patch('me/password')
  @ApiOperation({ summary: 'Alterar a senha do usuário logado' })
  @ApiBody({
    type: ChangePasswordDto,
    description: 'Dados para alteração de senha.',
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Senha alterada com sucesso',
    schema: {
      example: { message: 'Senha alterada com sucesso' }
    }
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Senha atual incorreta.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'As senhas não coincidem.' })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req
  ) {
    return this.usersService.changePassword(req.user.userId, changePasswordDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Buscar um usuário pelo ID (Admin apenas)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Usuário encontrado com sucesso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado. Apenas administradores.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar um usuário existente (Admin apenas)' })
  @ApiBody({
    type: UpdateUserDto, 
    description: 'Dados para atualização do usuário.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado. Apenas administradores.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover um usuário pelo ID (Admin apenas)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Usuário removido com sucesso.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado. Apenas administradores.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}