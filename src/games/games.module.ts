import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { gamesProviders } from './games.providers';
import { FilesModule } from 'src/files/files.module';
import { GameHelperService } from './games-helper.service';
import { LikesModule } from 'src/likes/likes.module';

@Module({
  controllers: [GamesController],
  providers: [GamesService, GameHelperService, ...gamesProviders],
  imports: [FilesModule, LikesModule],
  exports: [GamesService]
})
export class GamesModule { }
