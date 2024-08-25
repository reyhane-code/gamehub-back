import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { IUser } from 'src/users/interfaces/user.interface';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { paginationDefault } from 'src/constance';
import { BookmarkAbleEntity } from 'src/enums/database.enum';
import { IGetUserBookmarksQuery } from './interfaces/get-user-bookmarks-query';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private bookmarksService: BookmarksService) {}

  @UseGuards(AuthGuard)
  @Post('/:entityType/:entityId')
  async bookmark(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: number,
    @CurrentUser() user: IUser,
  ) {
    return this.bookmarksService.bookmark(user.id, entityId, entityType);
  }

  @UseGuards(AuthGuard)
  @Delete('/:entityType/:entityId')
  async removeBookmark(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: number,
    @CurrentUser() user: IUser,
  ) {
    return this.bookmarksService.removeBookmark(user.id, entityId, entityType);
  }

  @Get('/:entityType/:entityId')
  async getBookmarks(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: number,
  ) {
    return this.bookmarksService.findBookmarks(entityId, entityType);
  }

  @UseGuards(AuthGuard)
  @Get('/user/:entityType/:expand?')
  async getUserBookmarkedEntities(
    @Param('entityType') entityType: BookmarkAbleEntity,
    @CurrentUser() user: IUser,
    @Query() query: IGetUserBookmarksQuery,
  ) {
    return this.bookmarksService.findUserBookmarkedEntity(
      user.id,
      entityType,
      query,
    );
  }
}
