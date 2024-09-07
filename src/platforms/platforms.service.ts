import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Platform } from 'models/platform.model';
import { Repository } from 'src/enums/database.enum';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { AddPlatformDto } from './dtos/add-platform.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { UpdatedPlatformDto } from './dtos/update-platform.dto';
import { toSlug } from 'src/helpers/helpers';
import { buildQueryOptions } from 'src/helpers/dynamic-query-helper';
import { deleteEntity, findOneById, updateEntity } from 'src/helpers/crud-helper';

@Injectable()
export class PlatformsService {
  constructor(
    @Inject(Repository.PLATFORMS)
    private platformsRepository: typeof Platform,
  ) { }

  async addPlatform({ name }: AddPlatformDto, user: IUser) {
    try {
      return this.platformsRepository.create({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        user_id: user.id,
      });
    } catch (error) {
      throw new BadRequestException('something went wrong!');
    }
  }

  async deletePlatform(id: number, isSoftDelete: boolean) {
    return deleteEntity(this.platformsRepository, 'platform', id, isSoftDelete)
  }
  async updatePlatform(id: number, { name }: UpdatedPlatformDto) {
    return updateEntity<Platform>(this.platformsRepository, 'platform', id,
      {
        name,
        slug: toSlug(name),
      }
    )
  }

  async findOneById(id: number) {
    return findOneById(this.platformsRepository, id, 'platform')
  }

  async findAll() {
    const platforms = await this.platformsRepository.findAll();
    return {
      items: platforms ?? []
    }
  }

  async findAllWithPaginate(query: IPaginationQueryOptions) {
    const { page, perPage, sortBy, where, include, limit, offset } =
      buildQueryOptions(query, Platform);

    const { count, rows } = await this.platformsRepository.findAndCountAll({
      limit,
      offset,
      where,
      include,
      order: sortBy ? this.platformsRepository.sequelize.literal(sortBy) : [],
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

  async findUserPlatforms(user: IUser) {
    const platforms = await this.platformsRepository.findAll({
      where: { user_id: user.id },
    })

    return {
      items: platforms ?? []
    }

  }
}
