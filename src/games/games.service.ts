import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Game } from 'models/game.model';
import { Genre } from 'models/genre.model';
import { Platform } from 'models/platform.model';
import { Repositories } from 'src/enums/database.enum';
import { getGamesQuery } from './interfaces/games.interface';
import { Op } from 'sequelize';
import { Publisher } from 'models/publisher.model';

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

  //TODO : fix order
  async getGames({
    page,
    perPage,
    genreId,
    platformId,
    search,
  }: getGamesQuery) {
    const { count, rows } = await this.gamesRepository.findAndCountAll({
      limit: perPage,
      offset: perPage * page,
      include: [
        { model: Platform, where: { id: platformId } },
        { model: Genre, where: { id: genreId } },
        { model: Publisher },
      ],
      where: { name: { [Op.like]: `%${search}%` } },
    });
    if (rows.length < 1) {
      throw new NotFoundException('NO game was found.');
    }

    const responseData = {
      count,
      data: rows,
      page,
      perPage,
      offset: perPage * page,
    };
    return responseData;
  }

  //   async addGame() {}

  //   async deleteGame() {}

  //   async updateGame() {}
}
