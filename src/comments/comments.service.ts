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
import { Op } from 'sequelize';
import { findOneById } from 'src/helpers/crud-helper';
import { User } from 'models/user.model';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(Repository.COMMENTS) private commentsRepository: typeof Comment,
    private readonly likesService: LikesService,
  ) { }

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

      return comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new BadRequestException(
        'Something went wrong when posting a comment!',
      );
    }
  }

  async updateComment(commentId: number, body: UpdateCommentDto, user: IUser) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    try {
      const [numberOfAffectedRows, [updatedEntity]] = await this.commentsRepository.update(
        {
          content: body.content,
          rate: body.rate,
        },
        {
          where: {
            id: commentId,
            user_id: user.id,
            createdAt: {
              [Op.gte]: oneHourAgo,
            },
            confirmed: true
          },
          returning: true
        },

      );

      if (numberOfAffectedRows === 0) {
        throw new BadRequestException('Comment not found or cannot be updated.');
      }

      return updatedEntity;
    } catch (error) {
      throw new BadRequestException('Something went wrong when updating a comment!');
    }
  }

  async findOneById(id: number) {
    return findOneById(this.commentsRepository, id, 'comment')
  }

  async findEntityComments(entityId: number, entityType: CommentAbleEntity) {
    const { rows, count } = await this.commentsRepository.findAndCountAll({
      where: { [`${entityType}_id`]: entityId },
      include: [{
        model: User,
        attributes: { exclude: ['password', 'phone', 'email', 'role', 'active', 'createdAt', 'updatedAt', 'deletedAt'] }
      }],
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
    const items = rows?.map((item) => item[item.entity_type]);
    return {
      count,
      items: items ?? [],
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

  async confirmComment(id: number) {
    try {
      return this.commentsRepository.update({ confirmed: true }, { where: { id } })
    } catch (error) {
      throw new BadRequestException('Something went wrong!')
    }
  }
}
