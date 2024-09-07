import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Game } from 'models/game.model';
import { Genre } from 'models/genre.model';
import { Platform } from 'models/platform.model';
import { LikeAbleEntity, Repository } from 'src/enums/database.enum';
import { Publisher } from 'models/publisher.model';
import { AddGameDto } from './dtos/add-game.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { UpdateGameDto } from './dtos/update-game.dto';
import { toSlug } from 'src/helpers/helpers';
import { GameHelperService } from './games-helper.service';
import { LikesService } from 'src/likes/likes.service';
import { Screenshot } from 'models/screenshot.model';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { buildQueryOptions } from 'src/helpers/dynamic-query-helper'
import { deleteEntity, findOneById } from 'src/helpers/crud-helper';

@Injectable()
export class GamesService {
  constructor(
    @Inject(Repository.GAMES) private gamesRepository: typeof Game,
    private readonly gameHelperService: GameHelperService,
    private readonly likesService: LikesService,
  ) { }

  async addGame(
    {
      name,
      description,
      rating_top,
      metacritic,
      platformIds,
      publisherIds,
      genreIds,
      image_alt,
    }: AddGameDto,
    user: IUser,
    imageFile?: Express.Multer.File,
    screenshots?: Express.Multer.File[],
  ) {
    let imageHashKey = null;
    let imageFileExtension = null;
    let game: Game;

    if (imageFile) {
      [imageHashKey, imageFileExtension] =
        imageFile?.filename?.split('.') || [];
    }

    try {
      game = await this.gamesRepository.create({
        name,
        slug: toSlug(name),
        description,
        background_image: imageHashKey,
        rating_top,
        metacritic,
        user_id: user.id,
      });
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong while adding the game.',
      );
    }

    if (imageFile) {
      await this.gameHelperService.saveImageFileToDB(
        imageFile,
        image_alt,
        imageHashKey,
        imageFileExtension,
      );
    }

    if (screenshots && screenshots.length > 0) {
      await this.gameHelperService.saveScreenshotsToDB(screenshots, game.id);
    }

    await this.gameHelperService.addGameToRelationTables(
      game.id,
      platformIds,
      publisherIds,
      genreIds,
    );

    return game;
  }

  async findOneById(id: number) {
    return findOneById(this.gamesRepository, id, 'game')
  }

  async findGamesWithPaginate(query: IPaginationQueryOptions) {
    const { where, include, sortBy, page, perPage, limit, offset } = buildQueryOptions(query, Game)

    if (!include.includes({ model: Genre }) || !include.includes({ model: Platform })) {
      include.push({ model: Genre });
      include.push({ model: Platform });
    }
    include.push({ model: Publisher });


    const { count, rows } = await this.gamesRepository.findAndCountAll({
      limit,
      offset,
      where,
      include,
      order: sortBy ? this.gamesRepository.sequelize.literal(sortBy) : [],
      distinct: true,
    });



    const gameIds = rows?.map((game) => game.id) ?? [];
    const likesCount =
      await this.likesService.getLikesCountForAllEntitiesWithIds(
        LikeAbleEntity.GAME,
        gameIds,
      );

    return {
      pagination: {
        count,
        page,
        perPage,
      },
      items: rows ?? [],
      likes: likesCount,
    };
  }

  async deleteGame(gameId: number, isSoftDelete: boolean) {
    return deleteEntity(this.gamesRepository, 'game', gameId, isSoftDelete)
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
    const foundGame = await this.findOneById(id);
    try {
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

  async findUserGames(user: IUser) {
    const games = await this.gamesRepository.findAll({
      where: { user_id: user.id },
    });
    return {
      items: games ?? []
    }
  }

  async findGameBySlug(slug: string) {
    const game = await this.gamesRepository.findOne({
      where: { slug },
      include: [
        { model: Genre },
        { model: Publisher },
        { model: Platform },
        { model: Screenshot },
      ],
    });
    if (!game) {
      throw new NotFoundException('No game was found.');
    }
    const likesCount = await this.likesService.getLikesCountForEntity(
      game.id,
      LikeAbleEntity.GAME,
    );
    return { game, likes: likesCount };
  }
}
