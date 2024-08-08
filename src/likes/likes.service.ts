// like.service.ts
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Like } from 'models/like.model';
import { Repository, LikeAbleEntity } from 'src/enums/database.enum';

@Injectable()
export class LikesService {
  constructor(@Inject(Repository.LIKES) private likesRepository: typeof Like) {}

  async likeEntity(
    userId: number,
    entityId: number,
    entityType: LikeAbleEntity,
  ) {
    const like = await this.likesRepository.findOne({
      where: {
        user_id: userId,
        [`${entityType}_id`]: entityId,
      },
    });
    if (like) {
      throw new ConflictException('You have liked this before');
    }
    try {
      return this.likesRepository.create({
        user_id: userId,
        [`${entityType}_id`]: entityId,
        entity_type: entityType,
      });
    } catch (error) {
      throw new BadRequestException('Something went wrong when liking!');
    }
  }

  async unlikeEntity(
    userId: number,
    entityId: number,
    entityType: LikeAbleEntity,
  ) {
    await this.findOne(userId, entityId, entityType);
    try {
      return this.likesRepository.destroy({
        where: {
          user_id: userId,
          [`${entityType}_id`]: entityId,
        },
        force: true,
      });
    } catch (error) {
      throw new BadRequestException('Something went wrong when unliking!');
    }
  }

  async getLikes(entityId: number, entityType: LikeAbleEntity) {
    const { rows, count } = await this.likesRepository.findAndCountAll({
      where: {
        [`${entityType}_id`]: entityId,
      },
    });
    if (count < 1) {
      throw new NotFoundException(`This ${entityType} has no likes!`);
    }
    return {
      count,
      data: rows,
    };
  }

  async findUserLikedEntity(userId: number, entityType: LikeAbleEntity) {
    const { rows, count } = await this.likesRepository.findAndCountAll({
      where: {
        user_id: userId,
        entity_type: entityType,
      },
    });
    if (count < 1) {
      throw new NotFoundException(`You did not like any !`);
    }
    return {
      count,
      data: rows,
    };
  }

  async findOne(userId: number, entityId: number, entityType: LikeAbleEntity) {
    const like = await this.likesRepository.findOne({
      where: {
        user_id: userId,
        [`${entityType}_id`]: entityId,
      },
    });
    if (!like) {
      throw new NotFoundException('You did not like this!');
    }
    return like;
  }
}
