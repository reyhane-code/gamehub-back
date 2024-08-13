import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { articlesProviders } from './articles.providers';
import { FilesService } from 'src/files/files.service';
import { LikesModule } from 'src/likes/likes.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, FilesService, ...articlesProviders],
  imports: [FilesModule, LikesModule],
})
export class ArticlesModule {}
