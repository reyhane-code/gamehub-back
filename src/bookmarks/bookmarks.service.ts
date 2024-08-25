import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Bookmark } from 'models/bookmark.model';
import { BookmarkAbleEntity, Repository } from 'src/enums/database.enum';
import { expandHandler, generatePaginationQuery } from 'src/helpers/helpers';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { IGetUserBookmarksQuery } from './interfaces/get-user-bookmarks-query';

@Injectable()
export class BookmarksService {
  constructor(
    @Inject(Repository.BOOKMARKS) private bookmarksRepository: typeof Bookmark,
  ) {}

  async bookmark(userId: number, entityId: number, entityType: string) {
    const bookmark = await this.bookmarksRepository.findOne({
      where: { user_id: userId, [`${entityType}_id`]: entityId },
    });
    if (bookmark) {
      throw new ConflictException('You have bookmarked this before');
    }
    try {
      return this.bookmarksRepository.create({
        user_id: userId,
        [`${entityType}_id`]: entityId,
        entity_type: entityType,
      });
    } catch (error) {
      throw new BadRequestException('Something went wrong when bookmarking!');
    }
  }

  async removeBookmark(userId: number, entityId: number, entityType: string) {
    await this.findOne(userId, entityId, entityType);
    try {
      return this.bookmarksRepository.destroy({
        where: {
          user_id: userId,
          [`${entityType}_id`]: entityId,
        },
        force: true,
      });
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong when removing bookmark!',
      );
    }
  }

  async findOne(userId: number, entityId: number, entityType: string) {
    const bookmark = await this.bookmarksRepository.findOne({
      where: { user_id: userId, [`${entityType}_id`]: entityId },
    });
    if (!bookmark) {
      throw new NotFoundException('You did not bookmark this!');
    }
    return bookmark;
  }

  async findBookmarks(entityId: number, entityType: string) {
    const { rows, count } = await this.bookmarksRepository.findAndCountAll({
      where: {
        [`${entityType}_id`]: entityId,
      },
    });
    return {
      count,
      items: rows ?? [],
    };
  }

  async findUserBookmarkedEntity(
    userId: number,
    entityType: BookmarkAbleEntity,
    query: IGetUserBookmarksQuery,
  ) {
    const association = Bookmark.associations[`${entityType}`].target;
    const { page, perPage } = generatePaginationQuery(query, Bookmark);
    const { rows, count } = await this.bookmarksRepository.findAndCountAll({
      where: {
        user_id: userId,
        entity_type: entityType,
      },
      include: {
        model: association,
        include: query.expand ? expandHandler(query.expand, association) : [],
      },
      distinct: true,
      limit: perPage,
      offset: (page - 1) * perPage,
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
}
