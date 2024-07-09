import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Game } from "models/game.model";
import { Genre } from "models/genre.model";
import { GenreGame } from "models/genre_game.model";
import { Platform } from "models/platform.model";
import { PlatformGame } from "models/platform_game.model";
import { Repositories } from "src/enums/database.enum";
import { paginationQueryOptions } from "src/interfaces/database.interfaces";

@Injectable()
export class GamesService {
  constructor(
    @Inject(Repositories.GAMES) private gamesRepository: typeof Game
  ) {}

  async findOneBySlug(slug: string) {
    const game = await this.gamesRepository.findOne({ where: { slug } });
    if (!game) {
      throw new NotFoundException("NO game was found.");
    }
    return game;
  }

  async getGames(
    genreId: number,
    platformId: number,
    { page, perPage }: paginationQueryOptions
  ) {
    const games = await this.gamesRepository.findAll({
      include: [
        {
          model: PlatformGame,
          include: [
            {
              model: Platform,
              as: "parent_platforms",
            },
          ],
          where: { platform_id: platformId },
        },
        {
          model: GenreGame,
          include: [
            {
              model: Genre,
            },
          ],
          where: { genre_id: genreId },
        },
      ],
      limit: perPage,
      offset: perPage * page,
    });
    if (!games) {
      throw new NotFoundException("NO game was found.");
    }
    return games;
  }

  //   async addGame() {}

  //   async deleteGame() {}

  //   async updateGame() {}
}
