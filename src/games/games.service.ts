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
import { buildQueryOptions } from 'src/helpers/dynamic-query-helper';
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
        image: imageHashKey,
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


  async findAllGames(query: IPaginationQueryOptions) {
    const { page, perPage, limit, offset } = buildQueryOptions(query, Game)

    const { count, rows } = await this.gamesRepository.findAndCountAll({
      limit,
      offset,
      distinct: true,
    });


    return {
      pagination: {
        count,
        page,
        perPage,
      },
      items: rows ?? [],
    };
  }

  async deleteGame(gameId: number, isSoftDelete: boolean) {
    return deleteEntity(this.gamesRepository, 'game', gameId, isSoftDelete)
  }

  async updateGame(body: UpdateGameDto, gameId: number,
    imageFile?: Express.Multer.File,
  ) {
    let imageHashKey = null;
    let imageFileExtension = null;
    let updateBody

    await findOneById(this.gamesRepository, gameId, 'game')

    if (imageFile) {
      [imageHashKey = null, imageFileExtension] =
        imageFile?.filename?.split('.') || [];

      updateBody = {
        name: body.name,
        slug: body.name && toSlug(body.name),
        description: body.description,
        image: imageHashKey

      }
    } else {
      updateBody = body
    }
    try {
      const updatedGame = await this.gamesRepository.update(updateBody, {
        where: { id: gameId },
        returning: true,
      });

      if (!updatedGame) {
        throw new BadRequestException('No rows were updated. Please check the entity ID.');
      }

      if (imageFile) {
        await this.gameHelperService.saveImageFileToDB(
          imageFile,
          imageFile.filename,
          imageHashKey,
          imageFileExtension,
        );
      }

      return updatedGame;
    } catch (error) {
      console.error('Update error:', error);
      throw new BadRequestException('Something went wrong during the update!');
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
