import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { gamesProviders } from './games.providers';
import { FilesModule } from 'src/files/files.module';
import { GameHelperService } from './games-helper.service';

@Module({
  controllers: [GamesController],
  providers: [GamesService, GameHelperService, ...gamesProviders],
  imports: [FilesModule],
})
export class GamesModule {}
