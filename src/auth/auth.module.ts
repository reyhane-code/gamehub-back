import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CurrentUserMiddleware } from '../middlewares/current-user.middleware';
import { authProviders } from './auth.providers';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [
    JwtModule.register({}),
    SmsModule
  ],
  controllers: [AuthController],
  providers: [AuthService, ...authProviders],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
