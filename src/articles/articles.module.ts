import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { articlesProviders } from './articles.providers';
import { FilesService } from 'src/files/files.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, FilesService, ...articlesProviders],
})
export class ArticlesModule {}
