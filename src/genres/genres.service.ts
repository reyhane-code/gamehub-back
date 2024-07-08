import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Genre } from "models/genre.model";
import { Repositories } from "src/enums/database.enum";
import { paginationQueryOptions } from "src/interfaces/database.interfaces";

@Injectable()
export class GenresService {
  constructor(
    @Inject(Repositories.GENRES) private genresRepository: typeof Genre
  ) {}

  async addGenre() {}

  async deleteGenre() {}

  async updateGenre() {}

  async findOneById(id: number) {
    const genre = await this.genresRepository.findOne({ where: { id } });
    if (!genre) {
      throw new NotFoundException("No genre was found!");
    }
    return genre;
  }

  async findAll() {
    const genres = await this.genresRepository.findAll();
    if (!genres) {
      throw new NotFoundException("No genres was found!");
    }
    return genres;
  }

  async findAllWithPaginate({ perPage, page }: paginationQueryOptions) {
    const genres = await this.genresRepository.findAll({
      limit: perPage,
      offset: perPage * page,
    });
    if (!genres) {
      throw new NotFoundException("No genres was found!");
    }
    return genres;
  }
}
