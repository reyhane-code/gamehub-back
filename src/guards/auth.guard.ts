import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request?.raw?.currentUser;
    if (!user) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource!',
      );
    }
    return user;
  }
}
