import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar primeiro usuário admin (público)' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Dados para criação do primeiro usuário admin.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário admin criado com sucesso. Retorna token de acesso.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Registro público apenas para o primeiro usuário do sistema.',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuário e obter token JWT' })
  @ApiBody({
    type: LoginRequestDto,
    description: 'Credenciais (email e password) do usuário.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido. Retorna o token de acesso.',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @UseGuards(AuthGuard('local'))
  async login(@Body() loginRequestDto: LoginRequestDto, @Request() req) {
    return this.authService.login(req.user);
  }

  // ALTERNATIVA SEM AuthGuard (descomente se preferir):
  // async login(@Body() loginRequestDto: LoginRequestDto) {
  //     const user = await this.authService.validateUser(
  //         loginRequestDto.email,
  //         loginRequestDto.password
  //     );
  //
  //     if (!user) {
  //         throw new UnauthorizedException('Credenciais inválidas');
  //     }
  //
  //     return this.authService.login(user);
  // }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Fazer logout do usuário (invalidar token)' })
  @ApiResponse({
    status: 200,
    description: 'Logout realizado com sucesso',
    schema: {
      example: {
        success: true,
        message:
          'Logout realizado com sucesso. Token deve ser descartado pelo cliente.',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente.' })
  async logout(@Request() req) {
    return {
      success: true,
      message:
        'Logout realizado com sucesso. Token deve ser descartado pelo cliente.',
    };
  }
}
