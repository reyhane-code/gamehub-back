import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { IUser } from 'src/users/interfaces/user.interface';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private bookmarksService: BookmarksService) {}

  @UseGuards(AuthGuard)
  @Post('/:entityType/:entityId')
  async like(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: number,
    @CurrentUser() user: IUser,
  ) {
    return this.bookmarksService.bookmark(user.id, entityId, entityType);
  }

  @UseGuards(AuthGuard)
  @Delete('/:entityType/:entityId')
  async unlike(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: number,
    @CurrentUser() user: IUser,
  ) {
    return this.bookmarksService.removeBookmark(user.id, entityId, entityType);
  }

  @Get('/:entityType/:entityId')
  async getLikes(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: number,
  ) {
    return this.bookmarksService.findBookmarks(entityId, entityType);
  }

  @UseGuards(AuthGuard)
  @Get('/user/:entityType')
  async getUserLikes(
    @Param('entityType') entityType: string,
    @CurrentUser() user: IUser,
  ) {
    return this.bookmarksService.findUserBookmarkedEntity(user.id, entityType);
  }
}
