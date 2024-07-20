import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Platform } from 'models/platform.model';
import { Repositories } from 'src/enums/database.enum';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { AddPlatformDto } from './dtos/add-platform.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { UpdatedPlatformDto } from './dtos/update-platform.dto';

@Injectable()
export class PlatformsService {
  constructor(
    @Inject(Repositories.PLATFORMS)
    private platformsRepository: typeof Platform,
  ) {}

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
    if (isSoftDelete) {
      return this.platformsRepository.destroy({ where: { id } });
    } else {
      return this.platformsRepository.destroy({
        where: { id },
        force: true,
      });
    }
  }
  async updatePlatform(id: number, { name }: UpdatedPlatformDto) {
    try {
      await this.findOneById(id);
      return this.platformsRepository.update(
        {
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
        },
        { where: { id } },
      );
    } catch (error) {
      throw new BadRequestException('something went wrong!');
    }
  }

  async findOneById(id: number) {
    const platform = await this.platformsRepository.findOne({ where: { id } });
    if (!platform) {
      throw new NotFoundException('No platform was found!');
    }
    return platform;
  }

  async findAll() {
    const platforms = await this.platformsRepository.findAll();
    if (platforms.length < 1) {
      throw new NotFoundException('No platforms was found!');
    }
    return platforms;
  }

  async findAllWithPaginate({ perPage, page }: IPaginationQueryOptions) {
    const { count, rows } = await this.platformsRepository.findAndCountAll({
      limit: perPage,
      offset: perPage * (page - 1),
    });
    if (rows.length < 1) {
      throw new NotFoundException('No platforms was found!');
    }
    return {
      count,
      data: rows,
      page,
      perPage,
      offset: (page - 1) * perPage,
    };
  }

  async findUserPlatforms(user: IUser) {
    const platforms = await this.platformsRepository.findAll({
      where: { user_id: user.id },
    });
    if (platforms.length < 1) {
      throw new NotFoundException('No platforms was found!');
    }
    return platforms;
  }
}
