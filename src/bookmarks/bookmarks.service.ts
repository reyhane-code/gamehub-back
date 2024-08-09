import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Bookmark } from 'models/bookmark.model';
import { Repository } from 'src/enums/database.enum';

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
    if (count < 1) {
      throw new NotFoundException(`This ${entityType} has no bookmarks!`);
    }
    return {
      count,
      data: rows,
    };
  }

  async findUserBookmarkedEntity(userId: number, entityType: string) {
    const { rows, count } = await this.bookmarksRepository.findAndCountAll({
      where: {
        user_id: userId,
        entity_type: entityType,
      },
    });
    if (count < 1) {
      throw new NotFoundException(`You did not bookmark any ${entityType}s!`);
    }
    return {
      count,
      data: rows,
    };
  }
}
