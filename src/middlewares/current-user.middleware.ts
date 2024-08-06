import { Request, Response, NextFunction } from 'express';
import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { User } from 'models/user.model';
import { Repository } from 'src/enums/database.enum';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) protected cacheManager: Cache,
    @Inject(Repository.USERS) private userRepository: typeof User,
  ) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const accessToken = req.headers?.authorization;
    if (!accessToken) return next();

    try {
      const token = accessToken.split(' ')[1];
      const verifyData = await this.jwtService.verify(token, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });
      if (!verifyData?.aud) return next();

      const blockData = await this.cacheManager.get(`block-${verifyData.aud}`);
      if (blockData && blockData == token) {
        throw new UnauthorizedException();
      }
      const user = await this.userRepository.findOne({
        where: {
          id: verifyData.aud,
        },
      });
      if (user) {
        // @ts-ignore
        req.currentUser = user;
      }
    } catch (e) {
      // console.log('e of verify', e);
    }

    next();
  }
}
