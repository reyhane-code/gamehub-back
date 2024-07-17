import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from 'src/enums/database.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const currentUser = request?.raw?.currentUser;

    if (
      currentUser &&
      (currentUser.role === Role.SUPER || currentUser.role === Role.ADMIN)
    ) {
      return true; // Allow access for super and admin roles
    }

    return false; // Deny access for other roles
  }
}
