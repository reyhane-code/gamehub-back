import { Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { getGamesQuery } from './interfaces/games.interface';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get('/:id')
  getGame(@Param('id') id: number) {
    return this.gamesService.findOneById(id);
  }

  @Get('/all')
  getGames(
    @Query()
    query: getGamesQuery,
  ) {
    return this.gamesService.getGames(query);
  }

  @Delete('/:id')
  softDelete(@Param('id') id: number, @Query() isSoftDelete: boolean = true) {
    return this.gamesService.deleteGame(id, isSoftDelete);
  }
}
