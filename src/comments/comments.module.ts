import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { commentsProviders } from './comments.providers';
import { LikesModule } from 'src/likes/likes.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, ...commentsProviders],
  imports: [LikesModule],
})
export class CommentsModule { }
