import { Controller, Get, Param, Query } from "@nestjs/common";
import { GamesService } from "./games.service";
import { paginationQueryOptions } from "src/interfaces/database.interfaces";

@Controller("game")
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get("/:id")
  getGame(@Param("id") id: number) {
    return this.gamesService.findOneById(id);
  }

  @Get("/all")
  getGames() {
    return this.gamesService.getGames();
  }

  @Get("/all/paginate")
  getGamesWithPaginat(@Query() query: paginationQueryOptions) {
    return this.gamesService.getGamesWithPaginate(query);
  }
}
