import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from './models/user.model';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  
  @Get()
    @Roles(UserRole.ADMIN) // Apenas admins podem listar todos os usuários
    findAll() {
        return this.usersService.findAll();
    }

    @Get('me') // Rota para o usuário ver seus próprios dados
    // @Roles() // Qualquer papel logado pode acessar
    getProfile(@Request() req) {
        return this.usersService.findOne(req.user.userId);
    }


    @Delete(':id')
    @Roles(UserRole.ADMIN) // Apenas admins podem deletar
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.remove(id);
    }
}
