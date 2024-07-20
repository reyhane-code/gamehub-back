import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Genre } from 'models/genre.model';
import { Repositories } from 'src/enums/database.enum';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { IUser } from 'src/users/interfaces/user.interface';
import { AddGenreDto } from './dtos/add-genre.dto';
import { UpdateGenreDto } from './dtos/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @Inject(Repositories.GENRES) private genresRepository: typeof Genre,
  ) {}

  async addGenre({ name }: AddGenreDto, user: IUser) {
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
    if (genres.length < 1) {
      throw new NotFoundException('No genres was found!');
    }
    return genres;
  }

  async findAllWithPaginate({ perPage, page }: IPaginationQueryOptions) {
    const { count, rows } = await this.genresRepository.findAndCountAll({
      limit: perPage,
      offset: perPage * (page - 1),
    });
    if (rows.length < 1) {
      throw new NotFoundException('No genres was found!');
    }
    return {
      count,
      data: rows,
      page,
      perPage,
      offset: (page - 1) * perPage,
    };
  }

  findUserGenres(user: IUser) {
    return this.genresRepository.findAll({ where: { user_id: user.id } });
  }
}
