import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './custom-exceptions/all-exception-filter';
import { DatabaseModule } from './database/database.module';
import { LangMiddleware } from './middlewares/lang-middleware';
import { GamesModule } from './games/games.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'medium',
          ttl: 60000,
          limit: 30,
        },
      ],
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    GamesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LangMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
