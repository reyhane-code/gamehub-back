import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Platform } from "models/platform.model";
import { Repositories } from "src/enums/database.enum";
import { paginationQueryOptions } from "src/interfaces/database.interfaces";

@Injectable()
export class PlatformsService {
  constructor(
    @Inject(Repositories.PLATFORMS) private platformsRepository: typeof Platform
  ) {}

  async addGenre() {}

  async deleteGenre() {}

  async updateGenre() {}

  async findOneById(id: number) {
    const genre = await this.platformsRepository.findOne({ where: { id } });
    if (!genre) {
      throw new NotFoundException("No platform was found!");
    }
    return genre;
  }

  async findAll() {
    const platforms = await this.platformsRepository.findAll();
    if (!platforms) {
      throw new NotFoundException("No platforms was found!");
    }
    return platforms;
  }

  async findAllWithPaginate({ perPage, page }: paginationQueryOptions) {
    const platforms = await this.platformsRepository.findAll({
      limit: perPage,
      offset: perPage * page,
    });
    if (!platforms) {
      throw new NotFoundException("No platforms was found!");
    }
    return platforms;
  }
}
