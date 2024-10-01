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
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { buildQueryOptions } from 'src/helpers/dynamic-query-helper';
import { Sequelize } from 'sequelize-typescript';


@Injectable()
export class CommentsService {
  constructor(
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
    @Inject(Repository.COMMENTS) private commentsRepository: typeof Comment,
    @Inject(Repository.LIKES) private likeRepository: typeof Like,
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
        parent_reply_id: body.parent_reply_id
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

  async findEntityComments(entityId: number, entityType: CommentAbleEntity, query: IPaginationQueryOptions) {
    const { page, perPage, limit, offset } = buildQueryOptions(query, Comment);

    const { count, rows } = await this.commentsRepository.findAndCountAll({
      where: { [`${entityType}_id`]: entityId, confirmed: true },
      include: [
        {
          model: Like,
          required: false, // This will perform a LEFT JOIN
          where: { deletedAt: null }, // Ensure only non-deleted likes are counted
        },
      ],
      // attributes: {
      //   include: [
      //     [this.commentsRepository.sequelize.fn('COUNT', this.commentsRepository.sequelize.col('likes.id')), 'likes_count'], // Count likes correctly
      //   ],
      // },
      // group: ['Comment.id'], // Group by comment ID
      limit,
      offset,
    });

    return {
      pagination: { count, page, perPage },
      items: rows ?? [],
    };
  }


  // async findEntityComments(entityId: number, entityType: CommentAbleEntity, query: IPaginationQueryOptions) {
  //   const { page, perPage, limit, offset } = buildQueryOptions(query, Comment);

  //   const { rows, count } = await this.commentsRepository.findAndCountAll({
  //     where: {
  //       [`${entityType}_id`]: entityId,
  //       parent_id: { [Op.ne]: null },
  //     },
  //     include: [
  //       {
  //         model: User,
  //         attributes: { exclude: ['password', 'phone', 'email', 'role', 'active', 'createdAt', 'updatedAt', 'deletedAt'] },
  //       },
  //       {
  //         model: Like,
  //         attributes: [],
  //       },
  //     ],
  //     limit,
  //     offset,
  //   });

  //   return {
  //     pagination: { count, page, perPage },
  //     items: rows ?? [],
  //   };
  // }
  // async findEntityComments(entityId: number, entityType: CommentAbleEntity, query: IPaginationQueryOptions) {
  //   const { page, perPage, limit, offset, } = buildQueryOptions(query, Comment);
  //   const { rows, count } = await this.commentsRepository.findAndCountAll({
  //     where: { [`${entityType}_id`]: entityId },
  //     include: [{
  //       model: User,
  //       attributes: { exclude: ['password', 'phone', 'email', 'role', 'active', 'createdAt', 'updatedAt', 'deletedAt'] }
  //     }],
  //     limit,
  //     offset
  //   });
  //   // const likesCount = await this.likesService.getLikesCountForAllEntities(
  //   //   LikeAbleEntity.COMMENT,
  //   // );
  //   return {
  //     pagination: { count, page, perPage },
  //     items: rows ?? [],
  //     // likes: likesCount,
  //   };
  // }

  //   async findCommentsWithLikes(postId: number, limit: number, offset: number) {
  //     const result = await this.commentModel.findAndCountAll({
  //       where: { postId }, // Filter comments by post ID
  //       include: [
  //         {
  //           model: User,
  //           attributes: ['id', 'name'], // Include user details if needed
  //         },
  //         {
  //           model: Like,
  //           attributes: [], // We don't need to select any fields from Like
  //         },
  //       ],
  //       attributes: {
  //         include: [
  //           [this.sequelize.fn('COUNT', this.sequelize.col('likes.id')), 'likeCount'], // Count of likes
  //         ],
  //       },
  //       group: ['Comment.id', 'User.id'], // Group by Comment ID and User ID
  //       limit, // Limit the number of records returned
  //       offset, // Offset for pagination
  //     });

  //     return result; // This will return both the comments and the total count
  //   }
  // }




  async findCommentReplies(parentId: number, replyId?: number) {
    const parentReplyUserAssosiation = replyId ? {
      model: Comment,
      where: { id: replyId },
      attributes: { exclude: ['user_id', 'game_id', 'article_id', 'entity_type', 'content', 'rate', 'confirmed', 'parent_id', 'parent_user_id', 'createdAt', 'updatedAt', 'deletedAt'] },
      include: [{ model: User, attributes: { exclude: ['password', 'phone', 'email', 'role', 'active', 'createdAt', 'updatedAt', 'deletedAt'] }, }]
    } : null

    const { rows, count } = await this.commentsRepository.findAndCountAll({
      where: { parent_id: parentId },
      include: [{ model: Like }, {
        model: User,
        attributes: { exclude: ['password', 'phone', 'email', 'role', 'active', 'createdAt', 'updatedAt', 'deletedAt'] }
      },
        parentReplyUserAssosiation
      ],
      distinct: true,
    });
    //TODO: check what to do??
    // const likesCount = await this.likesService.getLikesCountForAllEntitiesWithIds(
    //   LikeAbleEntity.COMMENT,
    // );
    return {
      count,
      items: rows ?? []
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

  async findAllComments(query: IPaginationQueryOptions) {
    const { page, perPage, limit, offset } = buildQueryOptions(query, Comment);
    const { count, rows } = await this.commentsRepository.findAndCountAll({
      limit, offset
    });

    return {
      pagination: {
        count,
        page,
        perPage
      },
      items: rows ?? []
    }
  }

  async confirmComment(id: number) {
    try {
      return this.commentsRepository.update({ confirmed: true }, { where: { id } })
    } catch (error) {
      throw new BadRequestException('Something went wrong!')
    }
  }
}
