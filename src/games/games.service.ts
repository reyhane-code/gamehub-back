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
import { IGamesQuery } from './interfaces/games.interface';
import { Publisher } from 'models/publisher.model';
import { AddGameDto } from './dtos/add-game.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { UpdateGameDto } from './dtos/update-game.dto';
import { toSlug } from 'src/helpers/helpers';
import { Like } from 'models/like.model';
import { GameHelperService } from './games-helper.service';
import { LikesService } from 'src/likes/likes.service';
import { Screenshot } from 'models/screenshot.model';

@Injectable()
export class GamesService {
  constructor(
    @Inject(Repository.GAMES) private gamesRepository: typeof Game,
    private readonly gameHelperService: GameHelperService,
    private readonly likesService: LikesService,
  ) {}

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

    // Handle image file if provided
    if (imageFile) {
      await this.gameHelperService.saveImageFileToDB(
        imageFile,
        image_alt,
        imageHashKey,
        imageFileExtension,
      );
    }

    // Handle screenshots if provided
    if (screenshots.length > 0) {
      await this.gameHelperService.saveScreenshotsToDB(screenshots, game.id);
    }

    // Add game to relation tables
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

  async getGames({
    page,
    perPage,
    genreId,
    platformId,
    order,
    params,
  }: IGamesQuery) {
    const query = this.gameHelperService.buildGamesQuery({
      page,
      perPage,
      genreId,
      platformId,
      order,
      params,
    });
    const { count, rows } = await this.gamesRepository.findAndCountAll({
      ...query,
      distinct: true,
    });
    if (count < 1) {
      throw new NotFoundException('NO game was found.');
    }

    const likesCount = await this.likesService.getLikesCountForAllEntities(
      LikeAbleEntity.GAME,
    );

    return {
      count,
      data: rows,
      page,
      perPage,
      offset: perPage * (page - 1),
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
    const likesCount = await this.likesService.getLikesCountForEntity(
      game.id,
      LikeAbleEntity.GAME,
    );
    if (!game) {
      throw new NotFoundException('No game was found.');
    }
    return { game, likes: likesCount };
  }
}
