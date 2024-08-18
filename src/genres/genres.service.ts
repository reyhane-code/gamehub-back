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
import { generatePaginationQuery } from 'src/helpers/helpers';

@Injectable()
export class GenresService {
  constructor(
    @Inject(Repository.GENRES) private genresRepository: typeof Genre,
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
    await this.findOneById(genreId);
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
    await this.findOneById(genreId);
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

  async findAllWithPaginate(query: IPaginationQueryOptions) {
    const { page, perPage, order, whereConditions, include } =
      generatePaginationQuery(query, Genre);

    const { count, rows } = await this.genresRepository.findAndCountAll({
      limit: perPage,
      offset: perPage * (page - 1),
      where: this.genresRepository.sequelize.literal(whereConditions),
      include: include.length > 0 ? include : undefined,
      order: order ? this.genresRepository.sequelize.literal(order) : [],
    });
    if (count < 1) {
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
