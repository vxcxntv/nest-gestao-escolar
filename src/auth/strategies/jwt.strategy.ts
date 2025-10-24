import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SUPER_SECRET_KEY_32_CHARS_LONG',
    });
  }

  // O Passport decodifica o token e nos entrega o payload
  async validate(payload: any) {
    // O objeto retornado aqui será injetado no `request.user` de qualquer rota protegida
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}