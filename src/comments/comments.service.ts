import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CommentAbleEntity,
  LikeAbleEntity,
  Repository,
} from 'src/enums/database.enum';
import { AddCommentDto } from './dtos/add-comment.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { Comment } from 'models/comment.model';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { Like } from 'models/like.model';
import { LikesService } from 'src/likes/likes.service';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(Repository.COMMENTS) private commentsRepository: typeof Comment,
    private readonly likesService: LikesService,
  ) {}

  async addComment(
    entityId: number,
    entityType: CommentAbleEntity,
    body: AddCommentDto,
    user: IUser,
  ) {
    try {
      const comment = await this.commentsRepository.create({
        user_id: user.id,
        [`${entityType}_id`]: entityId,
        entity_type: entityType,
        content: body.content,
        rate: body.rate,
        parent_id: body.parent_id,
      });

      return comment; // Return the created comment
    } catch (error) {
      console.error('Error adding comment:', error); // Log the error for debugging
      throw new BadRequestException(
        'Something went wrong when posting a comment!',
      );
    }
  }

  async updateComment(commentId: number, body: UpdateCommentDto, user: IUser) {
    await this.findOneById(commentId);
    try {
      return this.commentsRepository.update(
        {
          content: body.content,
          rate: body.rate,
        },
        {
          where: { id: commentId, user_id: user.id },
        },
      );
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong when updating a comment!',
      );
    }
  }

  async findOneById(id: number) {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('No comment was found!');
    }
    return comment;
  }

  async findEntityComments(entityId: number, entityType: CommentAbleEntity) {
    const { rows, count } = await this.commentsRepository.findAndCountAll({
      where: { [`${entityType}_id`]: entityId },
    });
    const likesCount = await this.likesService.getLikesCountForAllEntities(
      LikeAbleEntity.COMMENT,
    );
    return {
      count,
      items: rows ?? [],
      likes: likesCount,
    };
  }

  async findCommentReplies(parentId: number) {
    const { rows, count } = await this.commentsRepository.findAndCountAll({
      where: { parent_id: parentId },
      include: { model: Like },
      distinct: true,
    });
    //TODO: check what to do??
    // const likesCount = await this.likesService.getLikesCountForAllEntities(
    //   LikeAbleEntity.COMMENT,
    // );
    return {
      count,
      items: rows ?? [],
    };
  }

  async deleteComment(id: number, isSoftDelete: boolean, user: IUser) {
    await this.findOneById(id);
    if (isSoftDelete) {
      return this.commentsRepository.destroy({
        where: { id, user_id: user.id },
      });
    } else {
      return this.commentsRepository.destroy({
        where: { id, user_id: user.id },
        force: true,
      });
    }
  }
  async findUserComments(user: IUser, entityType: CommentAbleEntity) {
    const { rows, count } = await this.commentsRepository.findAndCountAll({
      where: { user_id: user.id },
      include: { model: Comment.associations[`${entityType}`].target },
      distinct: true,
    });
    const likesCount = await this.likesService.getLikesCountForAllEntities(
      LikeAbleEntity.COMMENT,
    );
    return {
      count,
      items: rows ?? [],
      likes: likesCount,
    };
  }

  async findAllComments() {
    const comments = await this.commentsRepository.findAll({
      include: { model: Like },
    });
    if (!comments) {
      throw new NotFoundException('No comments were found!');
    }
    return comments;
  }
}
