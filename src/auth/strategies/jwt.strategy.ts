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

  async validate(payload: any) {
  console.log('🎯 JWT Strategy EXECUTANDO - Payload:', payload);
  
  // ✅ Retorne o user baseado apenas no payload (SEM banco)
  const user = {
    userId: payload.sub,
    email: payload.email,
    role: payload.role
  };
  
  console.log('✅ User que será injetado:', user);
  return user;
}
}