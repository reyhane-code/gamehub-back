import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Game } from 'models/game.model';
import { Genre } from 'models/genre.model';
import { Platform } from 'models/platform.model';
import { Repositories } from 'src/enums/database.enum';
import { getGamesQuery } from './interfaces/games.interface';
import { Op } from 'sequelize';
import { Publisher } from 'models/publisher.model';
import { sortOperation } from 'src/enums/order.enum';
import { paginationDefault } from 'src/constance';
import { AddGameDto } from './dtos/add-game.dto';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { UpdateGameDto } from './dtos/update-game.dto';
import { PlatformGame } from 'models/platform_game.model';
import { PublisherGame } from 'models/publisher_game.model';
import { GenreGame } from 'models/genre_game.model';
import { toSlug } from 'src/helpers/helpers';

@Injectable()
export class GamesService {
  constructor(
    @Inject(Repositories.GAMES) private gamesRepository: typeof Game,
    @Inject(Repositories.PLATFORM_GAMES)
    private platformGamesRepository: typeof PlatformGame,
    @Inject(Repositories.PUBLISHER_GAMES)
    private publisherGamesRepository: typeof PublisherGame,
    @Inject(Repositories.GENRE_GAMES)
    private genreGamesRepository: typeof GenreGame,
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

    const { count, rows } = await this.gamesRepository.findAndCountAll(query);
    if (rows.length < 1) {
      throw new NotFoundException('NO game was found.');
    }

    return {
      count,
      data: rows,
      page,
      perPage,
      offset: perPage * (page - 1),
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
  async addGame(
    {
      name,
      description,
      background_image,
      rating_top,
      metacritic,
      platformId,
      publisherId,
      genreId,
    }: AddGameDto,
    user: UserInterface,
  ) {
    try {
      const game = await this.gamesRepository.create({
        name,
        slug: toSlug(name),
        description,
        background_image,
        rating_top,
        metacritic,
        user_id: user.id,
      });
      await this.addGameToRelationTables(
        game.id,
        platformId,
        publisherId,
        genreId,
      );
      return game;
    } catch (error) {
      throw new BadRequestException('something went wrong');
    }
  }

  async addGameToRelationTables(
    gameId: number,
    platformId: number,
    publisherId: number,
    genreId: number,
  ) {
    try {
      await this.platformGamesRepository.create({
        game_id: gameId,
        platform_id: platformId,
      });
      await this.publisherGamesRepository.create({
        game_id: gameId,
        publisher_id: publisherId,
      });
      await this.genreGamesRepository.create({
        game_id: gameId,
        genre_id: genreId,
      });
    } catch (error) {
      throw new BadRequestException('something went wrong');
    }
  }

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

  async updateGame(
    {
      name,
      description,
      background_image,
      rating_top,
      metacritic,
    }: UpdateGameDto,
    id: number,
  ) {
    try {
      const foundGame = await this.findOneById(id);
      return this.gamesRepository.update(
        {
          name,
          slug: name ? toSlug(name) : foundGame.slug,
          description,
          background_image,
          rating_top,
          metacritic,
        },
        { where: { id } },
      );
    } catch (error) {
      throw new BadRequestException('Something went wrong!');
    }
  }

  findUserGames(user: UserInterface) {
    return this.gamesRepository.findAll({ where: { user_id: user.id } });
  }
}
