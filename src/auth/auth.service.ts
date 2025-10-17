import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

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
                message: 'Logout realizado com sucesso. Token deve ser descartado pelo cliente.'
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente.' })
    async logout(@Request() req) {
        // Em uma implementação real, você poderia:
        // 1. Adicionar o token a uma blacklist
        // 2. Invalidar a sessão no banco de dados
        // 3. Limpar cookies se estiver usando
        
        // Por enquanto, apenas retornamos sucesso
        // O cliente deve remover o token do localStorage/sessionStorage
        return {
            success: true,
            message: 'Logout realizado com sucesso. Token deve ser descartado pelo cliente.'
        };
    }
}
