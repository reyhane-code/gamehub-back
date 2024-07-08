import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Platform } from "models/platform.model";
import { Repositories } from "src/enums/database.enum";
import { paginationQueryOptions } from "src/interfaces/database.interfaces";

@Injectable()
export class PlatformsService {
  constructor(
    @Inject(Repositories.PLATFORMS) private platformsRepository: typeof Platform
  ) {}

  async addPlatform() {}

  async deletePlatform() {}

  async updatePlatform() {}

  async findOneById(id: number) {
    const platform = await this.platformsRepository.findOne({ where: { id } });
    if (!platform) {
      throw new NotFoundException("No platform was found!");
    }
    return platform;
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
