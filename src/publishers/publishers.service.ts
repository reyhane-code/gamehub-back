import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Publisher } from 'models/publisher.model';
import { Repository } from 'src/enums/database.enum';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { AddPublisherDto } from './dtos/add-publisher.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { UpdatePublisherDto } from './dtos/update-publisher.dto';
import { buildQueryOptions } from 'src/helpers/dynamic-query-helper';
import { deleteEntity, findOneById, updateEntity } from 'src/helpers/crud-helper';


@Injectable()
export class PublishersService {
  constructor(
    @Inject(Repository.PUBLISHERS)
    private publishersRepository: typeof Publisher,
  ) { }

  async addPublisher({ name }: AddPublisherDto, user: IUser) {
    try {
      return this.publishersRepository.create({ name, user_id: user.id });
    } catch (error) {
      throw new BadRequestException('Something went wrong!');
    }
  }

  async deletePublisher(id: number, isSoftDelete: boolean) {
    return deleteEntity(this.publishersRepository, 'publisher', id, isSoftDelete)
  }

  async updatePublisher(id: number, { name }: UpdatePublisherDto) {
    return updateEntity<Publisher>(this.publishersRepository, 'publisher', id, { name })
  }

  async findOneById(id: number) {
    return findOneById(this.publishersRepository, id, 'publisher')
  }

  async findAll() {
    const publishers = await this.publishersRepository.findAll();
    return publishers ?? [];
  }

  async findAllWithPaginate(query: IPaginationQueryOptions) {
    const { page, perPage, sortBy, where, include, limit, offset } =
      buildQueryOptions(query, Publisher);

    const { count, rows } = await this.publishersRepository.findAndCountAll({
      limit,
      offset,
      where,
      include,
      order: sortBy ? this.publishersRepository.sequelize.literal(sortBy) : [],
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

  findUserPublishers(user: IUser) {
    try {
      return this.publishersRepository.findAll({ where: { user_id: user.id } });
    } catch (error) {
      throw new NotFoundException('No publishers were found for this user.');
    }
  }
}
