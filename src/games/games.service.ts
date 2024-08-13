import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Game } from 'models/game.model';
import { Genre } from 'models/genre.model';
import { Platform } from 'models/platform.model';
import { Repository } from 'src/enums/database.enum';
import { IGamesQuery } from './interfaces/games.interface';
import { Publisher } from 'models/publisher.model';
import { paginationDefault } from 'src/constance';
import { AddGameDto } from './dtos/add-game.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { UpdateGameDto } from './dtos/update-game.dto';
import { PlatformGame } from 'models/platform_game.model';
import { PublisherGame } from 'models/publisher_game.model';
import { GenreGame } from 'models/genre_game.model';
import { setWhereQuery, toSlug } from 'src/helpers/helpers';
import { sortOperation } from 'src/enums/enums';
import { Like } from 'models/like.model';
import { File } from 'models/file.model';
import { Screenshot } from 'models/screenshot.model';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class GamesService {
  constructor(
    @Inject(Repository.GAMES) private gamesRepository: typeof Game,
    @Inject(Repository.PLATFORM_GAMES)
    private platformGamesRepository: typeof PlatformGame,
    @Inject(Repository.PUBLISHER_GAMES)
    private publisherGamesRepository: typeof PublisherGame,
    @Inject(Repository.GENRE_GAMES)
    private genreGamesRepository: typeof GenreGame,
    @Inject(Repository.SCREENSHOTS)
    private screenshotsRepository: typeof Screenshot,
    private readonly filesService: FilesService,
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
    params,
  }: IGamesQuery) {
    const query = this.buildGamesQuery({
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

    return {
      count,
      data: rows,
      page,
      perPage,
      offset: perPage * (page - 1),
    };
  }

  buildGamesQuery({
    page,
    perPage,
    genreId,
    platformId,
    order,
    params,
  }: IGamesQuery) {
    const includeClauses = [
      genreId ? { model: Genre, where: { id: genreId } } : { model: Genre },
      platformId
        ? { model: Platform, where: { id: platformId } }
        : { model: Platform },
      { model: Publisher },
      { model: Like },
    ];

    const orderClause = order
      ? order.charAt(0) === '-'
        ? `${order.substring(1)} ${sortOperation.DESC}`
        : `${order} ${sortOperation.ASC}`
      : '';

    const whereClause = setWhereQuery(params);

    const pageVal = page || paginationDefault.page;
    const perPageVal = perPage || paginationDefault.perPage;

    return {
      limit: perPageVal,
      offset: (pageVal - 1) * perPageVal,
      include: includeClauses || [],
      where: this.gamesRepository.sequelize.literal(whereClause),
      order: orderClause
        ? this.gamesRepository.sequelize.literal(orderClause)
        : [],
    };
  }

  async addGame(
    {
      name,
      description,
      rating_top,
      metacritic,
      platformId,
      publisherId,
      genreId,
      image_alt,
    }: AddGameDto,
    user: IUser,
    imageFile?: Express.Multer.File,
    screenshots?: Express.Multer.File[],
  ) {
    try {
      const [imageHashKey = null, imageFileExtension] =
        imageFile?.filename?.split('.') || [];

      const game = await this.gamesRepository.create({
        name,
        slug: toSlug(name),
        description,
        background_image: imageFile ? imageHashKey : null,
        rating_top,
        metacritic,
        user_id: user.id,
      });

      // Handle image file if provided
      if (imageFile) {
        await this.filesService.saveImageFileToDB(
          imageFile,
          image_alt,
          imageHashKey,
          imageFileExtension,
        );
      }

      // Handle screenshots if provided
      if (screenshots) {
        await this.saveScreenshotsToDB(screenshots, game.id);
      }

      // Add game to relation tables
      await this.addGameToRelationTables(
        game.id,
        platformId,
        publisherId,
        genreId,
      );

      return game;
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong while adding the game.',
      );
    }
  }

  async saveScreenshotsToDB(
    screenshots: Express.Multer.File[],
    gameId: number,
  ) {
    const screenshotPromises = screenshots.map(async (screenshot) => {
      const [hashKey = null, fileExtension] =
        screenshot?.filename?.split('.') || [];

      await this.filesService.saveImageFileToDB(
        screenshot,
        screenshot.originalname,
        hashKey,
        fileExtension,
      );

      return this.screenshotsRepository.create({
        game_id: gameId,
        hash_key: hashKey,
      });
    });

    // Await all screenshot promises
    try {
      await Promise.all(screenshotPromises);
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong while saving screenshots!',
      );
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
        platform_id: Number(platformId),
      });
      await this.publisherGamesRepository.create({
        game_id: gameId,
        publisher_id: Number(publisherId),
      });
      await this.genreGamesRepository.create({
        game_id: gameId,
        genre_id: Number(genreId),
      });
    } catch (error) {
      throw new BadRequestException('something went wrong');
    }
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

  findUserGames(user: IUser) {
    return this.gamesRepository.findAll({ where: { user_id: user.id } });
  }

  async findGameBySlug(slug: string) {
    const game = await this.gamesRepository.findOne({
      where: { slug },
      include: [
        { model: Genre },
        { model: Publisher },
        { model: Platform },
        {
          model: Like,
        },
      ],
    });
    if (!game) {
      throw new NotFoundException('No game was found.');
    }
    return game;
  }
}
