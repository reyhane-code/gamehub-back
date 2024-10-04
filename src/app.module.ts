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
import { GenresModule } from './genres/genres.module';
import { PlatformsModule } from './platforms/platforms.module';
import { PublishersModule } from './publishers/publishers.module';
import { SmsModule } from './sms/sms.module';
import { LikesModule } from './likes/likes.module';
import { FilesModule } from './files/files.module';
import { MulterModule } from '@nestjs/platform-express';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { ArticlesModule } from './articles/articles.module';
import { HttpSecurityHeadersMiddleware } from './middlewares/http-security-headers.middleware';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MulterModule.register({
      dest: './files',
    }),
    GamesModule,
    GenresModule,
    PlatformsModule,
    PublishersModule,
    SmsModule,
    LikesModule,
    FilesModule,
    BookmarksModule,
    ArticlesModule,
    SearchModule,
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

    consumer
      .apply(HttpSecurityHeadersMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
