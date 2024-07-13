import { Controller, Get, Param, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { getGamesQuery } from './interfaces/games.interface';
import { sortOperation } from 'src/enums/order.enum';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get('/:slug')
  getGame(@Param('slug') slug: string) {
    return this.gamesService.findOneBySlug(slug);
  }

  @Get('/all')
  getGames(
    @Query()
    query: getGamesQuery,
  ) {
    return this.gamesService.getGames(query);
  }
}
