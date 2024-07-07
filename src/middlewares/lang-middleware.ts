import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LangMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    global.lang =
      req.headers?.lang || this.configService.get<string>('DEFAULT_LANG');

    next();
  }
}
