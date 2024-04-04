import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles, User } from 'src/controller/users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request, roles);
  }

  validateRequest(request: any, roles: string[]): boolean {
    const user: User = request.user;
    return roles.includes(user.Role ?? 'admin');
  }
}
