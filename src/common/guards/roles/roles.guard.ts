import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/models/user.model';
import { ROLES_KEY } from 'src/common/decorators/roles/roles.decorator';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      console.warn('⚠️ RolesGuard: User não encontrado no request');
      return false;
    }
    
    if (!user.role) {
      console.warn('⚠️ RolesGuard: User não tem role definida');
      return false;
    }

    const hasRequiredRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRequiredRole) {
      console.warn(`⚠️ RolesGuard: User role '${user.role}' não tem permissão. Roles necessárias:`, requiredRoles);
    }
    
    return hasRequiredRole;
  }
}