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
import { inspect } from 'util';

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
    const game = await this.gamesRepository.findOne({ where: { id } });
    if (!game) {
      throw new NotFoundException('NO game was found.');
    }
    return game;
  }

  async getGames(query: IPaginationQueryOptions) {
    const { where, include, sortBy, page, perPage, limit, offset } = buildQueryOptions(query, Game)

    if (!include.includes({ model: Genre }) || !include.includes({ model: Platform })) {
      include.push({ model: Genre });
      include.push({ model: Platform });
    }
    include.push({ model: Publisher });
    console.log(inspect(include, null, 10))


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
    await this.findOneById(gameId);
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
    const foundGame = await this.findOneById(id);
    try {
      await this.gamesRepository.update(
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
    if (games.length < 1) {
      throw new NotFoundException('This user does not have any games!');
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
