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

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

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
  getUserComments(@CurrentUser() user: IUser) {
    return this.commentsService.findUserComments(user);
  }

  @Get('/:entityType/:entityId')
  async getComments(
    @Param('entityType') entityType: CommentAbleEntity,
    @Param('entityId') entityId: number,
  ) {
    return this.commentsService.findEntityComments(entityId, entityType);
  }

  @Get('/replies/:id')
  getReplies(@Param('id') parentId: number) {
    return this.commentsService.findCommentReplies(parentId);
  }

  @Get()
  getAllComments() {
    return this.commentsService.findAllComments();
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
}
