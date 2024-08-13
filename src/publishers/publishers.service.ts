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
import { getOrderClause, setWhereQuery } from 'src/helpers/helpers';

@Injectable()
export class PublishersService {
  constructor(
    @Inject(Repository.PUBLISHERS)
    private publishersRepository: typeof Publisher,
  ) {}

  async addPublisher({ name }: AddPublisherDto, user: IUser) {
    try {
      return this.publishersRepository.create({ name, user_id: user.id });
    } catch (error) {
      throw new BadRequestException('Something went wrong!');
    }
  }

  async deletePublisher(id: number, isSoftDelete: boolean) {
    await this.findOneById(id);
    if (isSoftDelete) {
      return this.publishersRepository.destroy({ where: { id } });
    } else {
      return this.publishersRepository.destroy({
        where: { id },
        force: true,
      });
    }
  }

  async updatePublisher(id: number, { name }: UpdatePublisherDto) {
    await this.findOneById(id);
    try {
      return this.publishersRepository.update({ name }, { where: { id } });
    } catch (error) {
      throw new BadRequestException('Something went wrong!');
    }
  }

  async findOneById(id: number) {
    const publisher = await this.publishersRepository.findOne({
      where: { id },
    });
    if (!publisher) {
      throw new NotFoundException('No publisher was found!');
    }
    return publisher;
  }

  async findAll() {
    const publishers = await this.publishersRepository.findAll();
    if (publishers.length < 1) {
      throw new NotFoundException('No publishers was found!');
    }
    return publishers;
  }

  async findAllWithPaginate({
    perPage,
    page,
    search,
    order,
  }: IPaginationQueryOptions) {
    const whereClause = search ? setWhereQuery(search) : '';
    const orderClause = order ?? getOrderClause(order);
    const { count, rows } = await this.publishersRepository.findAndCountAll({
      limit: perPage,
      offset: perPage * (page - 1),
      where: this.publishersRepository.sequelize.literal(whereClause),
      order: orderClause
        ? this.publishersRepository.sequelize.literal(orderClause)
        : [],
    });
    if (count < 1) {
      throw new NotFoundException('No publishers was found!');
    }
    return {
      count,
      data: rows,
      page,
      perPage,
      offset: perPage * (page - 1),
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
