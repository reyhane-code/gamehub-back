import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from 'src/enums/database.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const currentUser = request?.raw?.currentUser;

    if (!currentUser) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource!',
      );
    }
    if (
      currentUser &&
      (currentUser.role === Role.SUPER || currentUser.role === Role.ADMIN)
    ) {
      return true;
    }

    throw new ForbiddenException('You can not access this route!')
  }
}
