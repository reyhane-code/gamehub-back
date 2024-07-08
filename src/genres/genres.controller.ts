import { Controller, Get, Param, Query } from "@nestjs/common";
import { GenresService } from "./genres.service";
import { paginationQueryOptions } from "src/interfaces/database.interfaces";

@Controller("genre")
export class GenresController {
  constructor(private genresService: GenresService) {}

  @Get("/:id")
  findGenre(@Param("id") id: number) {
    return this.genresService.findOneById(id);
  }

  @Get("/all")
  findGenres() {
    return this.genresService.findAll();
  }

  @Get("/all/paginate")
  findGenresWithPaginate(@Query() query: paginationQueryOptions) {
    return this.genresService.findAllWithPaginate(query);
  }
}
