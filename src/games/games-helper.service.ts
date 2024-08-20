import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GenreGame } from 'models/genre_game.model';
import { PlatformGame } from 'models/platform_game.model';
import { PublisherGame } from 'models/publisher_game.model';
import { Screenshot } from 'models/screenshot.model';
import { Repository } from 'src/enums/database.enum';
import { FilesService } from 'src/files/files.service';
import { generatePaginationQuery } from 'src/helpers/helpers';
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
    const screenshotPromises = screenshots?.map(async (screenshot) => {
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

  createRelations = (ids: number[], relationKey: string, gameId: number) => {
    return ids.map((id) => ({
      game_id: gameId,
      [relationKey]: id,
    }));
  };

  async addGameToRelationTables(
    gameId: number,
    platformIds: number[],
    publisherIds: number[],
    genreIds: number[],
  ) {
    const platforms = this.createRelations(platformIds, 'platform_id', gameId);
    const publishers = this.createRelations(
      publisherIds,
      'publisher_id',
      gameId,
    );
    const genres = this.createRelations(genreIds, 'genre_id', gameId);

    try {
      await Promise.all([
        this.platformGamesRepository.bulkCreate(platforms),
        this.publisherGamesRepository.bulkCreate(publishers),
        this.genreGamesRepository.bulkCreate(genres),
      ]);
    } catch (error) {
      throw new BadRequestException(
        'Failed to add game to relation tables: ' + error.message,
      );
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

  // buildGamesQuery(query: IGamesQuery) {
  //   console.log('queryBuild', query);
  //   const { page, perPage, order, whereConditions, include } =
  //     generatePaginationQuery(query, Game);
  //   return {
  //     limit: perPage,
  //     offset: (page - 1) * perPage,
  //     where: whereConditions,
  //     include: (include.length > 0) ? include : undefined,
  //     order: order ? this.gamesRepository.sequelize.literal(order) : [],
  //   };
  // }
}