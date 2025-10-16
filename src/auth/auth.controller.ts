import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto'; // Importamos o DTO de requisição
import { AuthResponseDto } from './dto/auth-response.dto'; // Importamos o DTO de resposta

@ApiTags('Autenticação') // Tag principal
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Endpoint de login que utiliza a estratégia 'local' do Passport para validar credenciais.
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Autenticar usuário e obter token JWT' })
    @ApiBody({ type: LoginRequestDto, description: 'Credenciais (email e password) do usuário.' })
    @ApiResponse({ status: 200, description: 'Login bem-sucedido. Retorna o token de acesso.', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
    @UseGuards(AuthGuard('local')) // O AuthGuard('local') é o que faz a validação da senha no AuthService
    async login(@Body() loginRequestDto: LoginRequestDto, @Request() req) {
        // Após a validação (AuthGuard('local')), o objeto do usuário é anexado ao req.user
        return this.authService.login(req.user);
    }

    // Nota: O endpoint GET /users/me já está documentado no UsersController
    // e é protegido pelo AuthGuard('jwt'), que é o endpoint de autenticação pós-login.
}
