import { Controller, Get, Param, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { paginationQueryOptions } from 'src/interfaces/database.interfaces';
import { getGamesQuery } from './interfaces/games.interface';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get('/:slug')
  getGame(@Param('slug') slug: string) {
    return this.gamesService.findOneBySlug(slug);
  }

  @Get('/all')
  getGames(@Query() query: getGamesQuery) {
    return this.gamesService.getGames(query);
  }
}
