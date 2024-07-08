import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Publisher } from "models/publisher.model";
import { Repositories } from "src/enums/database.enum";
import { paginationQueryOptions } from "src/interfaces/database.interfaces";

@Injectable()
export class PublishersService {
  constructor(
    @Inject(Repositories.PUBLISHERS)
    private publishersRepository: typeof Publisher
  ) {}

  async addPublisher() {}

  async deletePublisher() {}

  async updatePublisher() {}

  async findOneById(id: number) {
    const publisher = await this.publishersRepository.findOne({
      where: { id },
    });
    if (!publisher) {
      throw new NotFoundException("No publisher was found!");
    }
    return publisher;
  }

  async findAll() {
    const publishers = await this.publishersRepository.findAll();
    if (!publishers) {
      throw new NotFoundException("No publishers was found!");
    }
    return publishers;
  }

  async findAllWithPaginate({ perPage, page }: paginationQueryOptions) {
    const publishers = await this.publishersRepository.findAll({
      limit: perPage,
      offset: perPage * page,
    });
    if (!publishers) {
      throw new NotFoundException("No publishers was found!");
    }
    return publishers;
  }
}
