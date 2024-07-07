import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Game } from "models/game.model";
import { Repositories } from "src/enums/database.enum";
import { paginationQueryOptions } from "src/interfaces/database.interfaces";

@Injectable()
export class GamesService {
  constructor(
    @Inject(Repositories.GAMES) private gamesRepository: typeof Game
  ) {}

  async findOneById(id: number) {
    const game = await this.gamesRepository.findOne({ where: { id } });
    if (!game) {
      throw new NotFoundException("NO game was found.");
    }
    return game;
  }

  //TODO: join with others.
  async getGames() {
    const games = await this.gamesRepository.findAll();
    if (!games) {
      throw new NotFoundException("NO game was found.");
    }
    return games;
  }

  //TODO: join with others.
  async getGamesWithPaginate({ perPage, page }: paginationQueryOptions) {
    const games = await this.gamesRepository.findAll({
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
