import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { IUser } from 'src/users/interfaces/user.interface';
import { LikeAbleEntity } from 'src/enums/database.enum';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { paginationDefault } from 'src/constance';
import { IGetUseLikesQuery } from './intefaces/get-user-likes-query';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @UseGuards(AuthGuard)
  @Post('/:entityType/:entityId')
  async like(
    @Param('entityType') entityType: LikeAbleEntity,
    @Param('entityId') entityId: number,
    @CurrentUser() user: IUser,
  ) {
    return this.likesService.likeEntity(user.id, entityId, entityType);
  }

  @UseGuards(AuthGuard)
  @Delete('/:entityType/:entityId')
  async unlike(
    @Param('entityType') entityType: LikeAbleEntity,
    @Param('entityId') entityId: number,
    @CurrentUser() user: IUser,
  ) {
    return this.likesService.unlikeEntity(user.id, entityId, entityType);
  }

  @Get('/:entityType/:entityId')
  async getLikes(
    @Param('entityType') entityType: LikeAbleEntity,
    @Param('entityId') entityId: number,
  ) {
    return this.likesService.getLikes(entityId, entityType);
  }

  @UseGuards(AuthGuard)
  @Get('/user/:entityType/:expand?')
  async getUserLikes(
    @Param('entityType') entityType: LikeAbleEntity,
    @CurrentUser() user: IUser,
    @Query() query: IGetUseLikesQuery,
  ) {
    return this.likesService.findUserLikedEntity(user.id, entityType, query);
  }
}
