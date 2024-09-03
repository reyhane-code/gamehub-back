import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ArticlesModule } from 'src/articles/articles.module';
import { GamesModule } from 'src/games/games.module';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [ArticlesModule, GamesModule]
})
export class SearchModule { }
