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
import { expandHandler } from 'src/helpers/helpers';
import { IGetUseLikesQuery } from './intefaces/get-user-likes-query';
import { buildQueryOptions } from 'src/helpers/dynamic-query-helper';

@Injectable()
export class LikesService {
  constructor(@Inject(Repository.LIKES) private likesRepository: typeof Like) { }

  async likeEntity(
    userId: number,
    entityId: number,
    entityType: LikeAbleEntity,
  ) {
    const like = await this.didUserLike(userId, entityId, entityType)
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
    return {
      count,
      itmes: rows ?? [],
    };
  }

  async findUserLikedEntity(
    userId: number,
    entityType: LikeAbleEntity,
    query?: IGetUseLikesQuery,
  ) {
    console.log('assosiation', Like.associations[`${entityType}`].target)
    const association = Like.associations[`${entityType}`].target;
    const { page, perPage, limit, offset } = buildQueryOptions(query, Like);
    const { rows, count } = await this.likesRepository.findAndCountAll({
      where: {
        user_id: userId,
        entity_type: entityType,
      },
      include: association ? {
        model: association,
        include: query.expand ? expandHandler(query.expand, association) : [],
      } : [],
      distinct: true,
      limit,
      offset,
    });
    const items = rows.map((item) => item[item.entity_type]);
    return {
      pagination: {
        count,
        page,
        perPage,
      },
      items,
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

  async getLikesCountForEntity(entityId: number, entityType: LikeAbleEntity) {
    try {
      return this.likesRepository.count({
        where: { [`${entityType}_id`]: entityId },
      });
    } catch (error) {
      throw new Error('Could not retrieve likes count.');
    }
  }

  async getLikesCountForAllEntities(entityType: LikeAbleEntity) {
    try {
      return this.likesRepository.count({
        where: { entity_type: entityType },
        group: [`${entityType}_id`],
      });
    } catch (error) {
      throw new Error(`Could not retrieve likes count for ${entityType}s.`);
    }
  }

  async getLikesCountForAllEntitiesWithIds(
    entityType: LikeAbleEntity,
    ids: string[],
  ) {
    try {
      return this.likesRepository.count({
        where: { entity_type: entityType, [`${entityType}_id`]: ids },
        group: [`${entityType}_id`],
      });
    } catch (error) {
      throw new Error(`Could not retrieve likes count for ${entityType}s.`);
    }
  }

  async didUserLike(userId: number, entityId: number, entityType: LikeAbleEntity): Promise<boolean> {
    const likeExists = await this.likesRepository.findOne({
      where: {
        user_id: userId,
        [`${entityType}_id`]: entityId,
      },
    });
    return likeExists ? true : false;
  }

}
