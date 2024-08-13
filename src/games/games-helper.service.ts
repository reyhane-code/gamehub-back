import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GenreGame } from 'models/genre_game.model';
import { PlatformGame } from 'models/platform_game.model';
import { PublisherGame } from 'models/publisher_game.model';
import { Screenshot } from 'models/screenshot.model';
import { Repository } from 'src/enums/database.enum';
import { FilesService } from 'src/files/files.service';
import { IGamesQuery } from './interfaces/games.interface';
import { Genre } from 'models/genre.model';
import { Platform } from 'models/platform.model';
import { Publisher } from 'models/publisher.model';
import { Like } from 'models/like.model';
import { sortOperation } from 'src/enums/enums';
import { setWhereQuery } from 'src/helpers/helpers';
import { paginationDefault } from 'src/constance';
import { Game } from 'models/game.model';

@Injectable()
export class GameHelperService {
  constructor(
    @Inject(Repository.PLATFORM_GAMES)
    private platformGamesRepository: typeof PlatformGame,
    @Inject(Repository.PUBLISHER_GAMES)
    private publisherGamesRepository: typeof PublisherGame,
    @Inject(Repository.GENRE_GAMES)
    private genreGamesRepository: typeof GenreGame,
    @Inject(Repository.SCREENSHOTS)
    private screenshotsRepository: typeof Screenshot,
    private readonly filesService: FilesService,
    @Inject(Repository.GAMES) private gamesRepository: typeof Game,
  ) {}
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

  saveImageFileToDB(
    image: Express.Multer.File,
    alt: string,
    hashKey: string,
    fileType: string,
  ) {
    return this.filesService.saveImageFileToDB(image, alt, hashKey, fileType);
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
}
