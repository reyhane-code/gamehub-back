import { Controller, Get, Param, Query } from "@nestjs/common";
import { paginationQueryOptions } from "src/interfaces/database.interfaces";
import { PublishersService } from "./publishers.service";

@Controller("publisher")
export class PublishersController {
  constructor(private publisherService: PublishersService) {}

  @Get("/:id")
  findPublisher(@Param("id") id: number) {
    return this.publisherService.findOneById(id);
  }

  @Get("/all")
  findpublisher() {
    return this.publisherService.findAll();
  }

  @Get("/all/paginate")
  findpublisherWithPaginate(@Query() query: paginationQueryOptions) {
    return this.publisherService.findAllWithPaginate(query);
  }
}
