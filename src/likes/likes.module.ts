import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { likesProviders } from './likes.providers';

@Module({
  controllers: [LikesController],
  providers: [LikesService, ...likesProviders],
  exports: [LikesService],
})
export class LikesModule {}
