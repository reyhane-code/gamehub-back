import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { gamesProviders } from './games.providers';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [GamesController],
  providers: [GamesService, ...gamesProviders],
  imports: [FilesModule],
})
export class GamesModule {}
