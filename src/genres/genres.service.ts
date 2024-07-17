import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Genre } from 'models/genre.model';
import { Repositories } from 'src/enums/database.enum';
import { paginationQueryOptions } from 'src/interfaces/database.interfaces';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { AddGenreDto } from './dtos/add-genre.dto';
import { UpdateGenreDto } from './dtos/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @Inject(Repositories.GENRES) private genresRepository: typeof Genre,
  ) {}

  async addGenre({ name }: AddGenreDto, user: UserInterface) {
    try {
      return this.genresRepository.create({
        name,
        user_id: user.id,
      });
    } catch (error) {
      throw new BadRequestException('something went wrong!');
    }
  }

  async deleteGenre(genreId: number, isSoftDelete: boolean) {
    if (isSoftDelete) {
      return this.genresRepository.destroy({ where: { id: genreId } });
    } else {
      return this.genresRepository.destroy({
        where: { id: genreId },
        force: true,
      });
    }
  }

  async updateGenre(genreId: number, { name }: UpdateGenreDto) {
    try {
      return this.genresRepository.update({ name }, { where: { id: genreId } });
    } catch (error) {
      throw new BadRequestException('something went wrong!');
    }
  }

  async findOneById(id: number) {
    const genre = await this.genresRepository.findOne({ where: { id } });
    if (!genre) {
      throw new NotFoundException('No genre was found!');
    }
    return genre;
  }

  async findAll() {
    const genres = await this.genresRepository.findAll();
    if (!genres) {
      throw new NotFoundException('No genres was found!');
    }
    return genres;
  }

  async findAllWithPaginate({ perPage, page }: paginationQueryOptions) {
    const genres = await this.genresRepository.findAll({
      limit: perPage,
      offset: perPage * (page - 1),
    });
    if (genres.length < 1) {
      throw new NotFoundException('No genres was found!');
    }
    return {
      count: genres.length,
      data: genres,
      page,
      perPage,
      offset: page * perPage,
    };
  }

  findUserGenres(user: UserInterface) {
    return this.genresRepository.findAll({ where: { user_id: user.id } });
  }
}
