import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { articlesProviders } from './articles.providers';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, ...articlesProviders],
})
export class ArticlesModule {}
