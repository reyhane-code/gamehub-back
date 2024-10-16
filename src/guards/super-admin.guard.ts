import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from 'src/enums/database.enum';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const currentUser = request?.raw?.currentUser;

    if (!currentUser) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource!',
      );
    }

    if (currentUser && currentUser.role === Role.SUPER) {
      return true; // Allow access for super and admin roles
    }

    return false; // Deny access for other roles
  }
}
