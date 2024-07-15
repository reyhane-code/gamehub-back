import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Game } from 'models/game.model';
import { Genre } from 'models/genre.model';
import { Platform } from 'models/platform.model';
import { Repositories } from 'src/enums/database.enum';
import { getGamesQuery } from './interfaces/games.interface';
import { Op } from 'sequelize';
import { Publisher } from 'models/publisher.model';
import { sortOperation } from 'src/enums/order.enum';
import { paginationDefault } from 'src/constance';

@Injectable()
export class GamesService {
  constructor(
    @Inject(Repositories.GAMES) private gamesRepository: typeof Game,
  ) {}

  async findOneById(id: number) {
    const game = await this.gamesRepository.findOne({ where: { id } });
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
    order,
    search,
  }: getGamesQuery) {
    const query = this.buildGetGamesQuery({
      page,
      perPage,
      genreId,
      platformId,
      order,
    });
    //could not move to buildGetGamesQuery cause of Op.like types error
    query.where = search ? { name: { [Op.like]: `%${search}%` } } : {};

    const rows = await this.gamesRepository.findAll(query);
    if (rows.length < 1) {
      throw new NotFoundException('NO game was found.');
    }

    return {
      count: rows.length,
      data: rows,
      page,
      perPage,
      offset: perPage * page,
    };
  }

  buildGetGamesQuery({
    page,
    perPage,
    genreId,
    platformId,
    order,
  }: getGamesQuery) {
    const includeClauses = [
      genreId ? { model: Genre, where: { id: genreId } } : { model: Genre },
      platformId
        ? { model: Platform, where: { id: platformId } }
        : { model: Platform },
      { model: Publisher },
    ];

    const orderClause = order
      ? order.charAt(0) === '-'
        ? [order.substring(1), sortOperation.DESC]
        : [order, sortOperation.ASC]
      : [];

    const pageVal = page || paginationDefault.page;
    const perPageVal = perPage || paginationDefault.perPage;

    return {
      limit: perPageVal,
      offset: (pageVal - 1) * perPageVal,
      include: includeClauses || [],
      where: {},
      //Todo: fix this
      // order: orderClause || [],
    };
  }
  //   async addGame() {}

  async deleteGame(gameId: number, isSoftDelete: boolean) {
    if (isSoftDelete) {
      return this.gamesRepository.destroy({ where: { id: gameId } });
    } else {
      return this.gamesRepository.destroy({
        where: { id: gameId },
        force: true,
      });
    }
  }

  //   async updateGame() {}
}
