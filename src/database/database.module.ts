import { Global, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { databaseProviders } from './database.providers';

@Global()
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      auth_pass: process.env.REDIS_PASSWORD,
    }),
  ],
  providers: [CacheModule, ...databaseProviders],
  exports: [CacheModule, ...databaseProviders],
})
export class DatabaseModule {}
