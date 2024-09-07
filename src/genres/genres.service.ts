import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Genre } from 'models/genre.model';
import { Repository } from 'src/enums/database.enum';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { IUser } from 'src/users/interfaces/user.interface';
import { AddGenreDto } from './dtos/add-genre.dto';
import { UpdateGenreDto } from './dtos/update-genre.dto';
import { buildQueryOptions } from 'src/helpers/dynamic-query-helper';
import { deleteEntity, findOneById, updateEntity } from 'src/helpers/crud-helper';

@Injectable()
export class GenresService {
  constructor(
    @Inject(Repository.GENRES) private genresRepository: typeof Genre,
  ) { }

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
    return deleteEntity(this.genresRepository, 'genre', genreId, isSoftDelete)
  }

  async updateGenre(genreId: number, { name }: UpdateGenreDto) {
    return updateEntity<Genre>(this.genresRepository, 'genre', genreId, { name })
  }

  async findOneById(id: number) {
    return findOneById(this.genresRepository, id, 'genre')
  }

  async findAll() {
    const genres = await this.genresRepository.findAll();
    return genres ?? [];
  }

  async findAllWithPaginate(query: IPaginationQueryOptions) {
    const { page, perPage, sortBy, where, include, limit, offset } =
      buildQueryOptions(query, Genre);

    const { count, rows } = await this.genresRepository.findAndCountAll({
      limit,
      offset,
      where,
      include,
      order: sortBy ? this.genresRepository.sequelize.literal(sortBy) : [],
    });
    return {
      pagination: {
        count,
        page,
        perPage,
      },
      items: rows ?? [],
    };
  }

  findUserGenres(user: IUser) {
    return this.genresRepository.findAll({ where: { user_id: user.id } });
  }
}
