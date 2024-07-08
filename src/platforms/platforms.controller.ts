import { Controller, Get, Param, Query } from "@nestjs/common";
import { paginationQueryOptions } from "src/interfaces/database.interfaces";
import { PlatformsService } from "./platforms.service";

@Controller("platform")
export class GenresController {
  constructor(private platformsService: PlatformsService) {}

  @Get("/:id")
  findGenre(@Param("id") id: number) {
    return this.platformsService.findOneById(id);
  }

  @Get("/all")
  findplatforms() {
    return this.platformsService.findAll();
  }

  @Get("/all/paginate")
  findplatformsWithPaginate(@Query() query: paginationQueryOptions) {
    return this.platformsService.findAllWithPaginate(query);
  }
}
