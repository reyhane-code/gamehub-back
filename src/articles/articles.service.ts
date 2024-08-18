import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Article } from 'models/article.model';
import { AddArticleDto } from './dtos/add-article.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { LikeAbleEntity, Repository } from 'src/enums/database.enum';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { Comment } from 'models/comment.model';
import { FilesService } from 'src/files/files.service';
import { LikesService } from 'src/likes/likes.service';
import { generatePaginationQuery } from 'src/helpers/helpers';
import { Op } from 'sequelize';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject(Repository.ARTICLES) private articlesRepository: typeof Article,
    private readonly filesService: FilesService,
    private readonly likesService: LikesService,
  ) {}

  async createArticle(
    body: AddArticleDto,
    user: IUser,
    imageFile?: Express.Multer.File,
  ) {
    const foundArticle = await this.articlesRepository.findOne({
      where: { title: body.title },
    });
    if (foundArticle) {
      throw new ConflictException('This article is already created!');
    }
    try {
      const [hashKey = null, fileExtension] =
        imageFile?.filename?.split('.') || [];

      const article = await this.articlesRepository.create({
        title: body.title,
        content: body.content,
        user_id: user.id,
        image: imageFile ? hashKey : null,
      });

      if (imageFile) {
        await this.filesService.saveImageFileToDB(
          imageFile,
          body.imageAlt,
          hashKey,
          fileExtension,
        );
      }
      return article;
    } catch (error) {
      throw new BadRequestException('Something went wrong!');
    }
  }

  async findArticleById(id: number) {
    const article = await this.articlesRepository.findOne({
      where: { id },
      include: [{ model: Comment }],
    });

    if (!article) {
      throw new NotFoundException('No article was found!');
    }
    const likesCount = await this.likesService.getLikesCountForEntity(
      article.id,
      LikeAbleEntity.ARTICLE,
    );
    return { article, likes: likesCount };
  }

  async findArticleByTitle(title: string) {
    const article = await this.articlesRepository.findOne({ where: { title } });
    if (!article) {
      throw new NotFoundException('No article was found!');
    }
    return article;
  }

  async findArticles() {
    const articles = await this.articlesRepository.findAll({
      include: [{ model: Comment }],
    });
    if (articles.length < 1 || !articles) {
      throw new NotFoundException('No articles were found!');
    }
    const likesCount = await this.likesService.getLikesCountForAllEntities(
      LikeAbleEntity.ARTICLE,
    );
    return { articles, likes: likesCount };
  }

  async findOne(id: number) {
    const article = await this.articlesRepository.findOne({
      where: { id },
    });
    if (!article) {
      throw new NotFoundException('No article was found!');
    }
    return article;
  }

  async findArticlesWithPaginate(query: IPaginationQueryOptions) {
    const { page, perPage, order, whereConditions, include } =
      generatePaginationQuery(query, Article);
    const { rows, count } = await this.articlesRepository.findAndCountAll({
      limit: perPage,
      offset: perPage * (page - 1),
      where: this.articlesRepository.sequelize.literal(whereConditions),
      include: include.length > 0 ? include : undefined,
      order: order ? this.articlesRepository.sequelize.literal(order) : [],
    });
    if (count < 1) {
      throw new NotFoundException('No articles was found!');
    }
    const likesCount = await this.likesService.getLikesCountForAllEntities(
      LikeAbleEntity.ARTICLE,
    );

    return {
      count,
      data: rows,
      page,
      perPage,
      offset: (page - 1) * perPage,
      likes: likesCount,
    };
  }

  async findUserArticles(user: IUser) {
    const { rows, count } = await this.articlesRepository.findAndCountAll({
      where: { user_id: user.id },
      include: [{ model: Comment }],
      distinct: true,
    });
    if (count < 1) {
      throw new NotFoundException('No articles were found!');
    }
    return {
      count,
      data: rows,
    };
  }

  async updateArticle(body: UpdateArticleDto, articleId: number, user: IUser) {
    await this.findOne(articleId);
    try {
      const updatedArticle = await this.articlesRepository.update(body, {
        where: { id: articleId, user_id: user.id },
        returning: true,
      });
      return updatedArticle;
    } catch (error) {
      throw new BadRequestException('Something went wrong!');
    }
  }

  async deleteArticle(articleId: number, isSoftDelete: boolean, user: IUser) {
    await this.findOne(articleId);
    if (isSoftDelete) {
      return this.articlesRepository.destroy({
        where: { id: articleId, user_id: user.id },
      });
    } else {
      return this.articlesRepository.destroy({
        where: { id: articleId, user_id: user.id },
        force: true,
      });
    }
  }
}
