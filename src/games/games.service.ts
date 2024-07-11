import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Game } from 'models/game.model';
import { Genre } from 'models/genre.model';
import { GenreGame } from 'models/genre_game.model';
import { Platform } from 'models/platform.model';
import { PlatformGame } from 'models/platform_game.model';
import { Repositories } from 'src/enums/database.enum';
import { paginationQueryOptions } from 'src/interfaces/database.interfaces';
import { getGamesQuery } from './interfaces/games.interface';

@Injectable()
export class GamesService {
  constructor(
    @Inject(Repositories.GAMES) private gamesRepository: typeof Game,
  ) {}

  async findOneBySlug(slug: string) {
    const game = await this.gamesRepository.findOne({ where: { slug } });
    if (!game) {
      throw new NotFoundException('NO game was found.');
    }
    return game;
  }

  async getGames({
    page,
    perPage,
    genreId,
    platformId,
    ordering,
    search,
  }: getGamesQuery) {
    const games = await this.gamesRepository.findAll({
      include: [
        {
          model: Platform,
          where: { id: platformId },
        },
        {
          model: Genre,
          where: { id: genreId },
        },
      ],
      limit: perPage,
      offset: perPage * page,
      order: [ordering, 'ASC'],
    });
    if (!games) {
      throw new NotFoundException('NO game was found.');
    }
    const totalCount = await this.gamesRepository.count(); // Get total count of games

    const responseData = {
      count: totalCount,
      response: games,
      next: page < totalCount / perPage ? page + 1 : null, // Calculate next page based on current page and total count
    };
    return responseData;
  }

  //   async addGame() {}

  //   async deleteGame() {}

  //   async updateGame() {}
}
