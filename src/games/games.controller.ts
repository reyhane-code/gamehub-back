import { Controller, Get, Param, Query } from "@nestjs/common";
import { GamesService } from "./games.service";
import { paginationQueryOptions } from "src/interfaces/database.interfaces";

@Controller("game")
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get("/:slug")
  getGame(@Param("slug") slug: string) {
    return this.gamesService.findOneBySlug(slug);
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
