import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AddCommentDto } from './dtos/add-comment.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { IUser } from 'src/users/interfaces/user.interface';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { CommentAbleEntity } from 'src/enums/database.enum';
import { AdminGuard } from 'src/guards/admin.guard';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) { }

  @UseGuards(AuthGuard)
  @Post('/:entityType/:entityId')
  addComment(
    @Param('entityId') entityId: number,
    @Param('entityType') entityType: CommentAbleEntity,
    @Body() body: AddCommentDto,
    @CurrentUser() user: IUser,
  ) {
    return this.commentsService.addComment(entityId, entityType, body, user);
  }

  @Get('/:id')
  getComment(@Param('id') id: number) {
    return this.commentsService.findOneById(id);
  }

  @UseGuards(AuthGuard)
  @Get('/user/:entityType')
  getUserComments(
    @CurrentUser() user: IUser,
    @Param('entityType') entityType: CommentAbleEntity,
  ) {
    return this.commentsService.findUserComments(user, entityType);
  }

  @Get('/:entityType/:entityId')
  async getComments(
    @Param('entityType') entityType: CommentAbleEntity,
    @Param('entityId') entityId: number,
    @Query() query: IPaginationQueryOptions
  ) {
    return this.commentsService.findEntityComments(entityId, entityType, query);
  }

  @Get('/replies/:id/:replyId?')
  getReplies(@Param('id') parentId: number, @Param('replyId') replyId?: number) {
    return this.commentsService.findCommentReplies(parentId, replyId);
  }

  @UseGuards(AdminGuard)
  @Get()
  getAllComments(
    @Query() query: IPaginationQueryOptions
  ) {
    return this.commentsService.findAllComments(query);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  deleteComment(
    @Param('id') id: number,
    @Query() isSoftDelete: boolean = true,
    @CurrentUser() user: IUser,
  ) {
    return this.commentsService.deleteComment(id, isSoftDelete, user);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  udpateComment(
    @Param('id') id: number,
    @Body() body: UpdateCommentDto,
    @CurrentUser() user: IUser,
  ) {
    return this.commentsService.updateComment(id, body, user);
  }

  @UseGuards(AdminGuard)
  @Put('/confirm/:id')
  confirmComment(@Param('id') id: number) {
    return this.commentsService.confirmComment(id)
  }
}
