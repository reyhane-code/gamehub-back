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
import { buildQueryOptions } from 'src/helpers/dynamic-query-helper';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject(Repository.ARTICLES) private articlesRepository: typeof Article,
    private readonly filesService: FilesService,
    private readonly likesService: LikesService,
  ) { }

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
    });

    if (!article) {
      throw new NotFoundException('No article was found!');
    }
    await this.articlesRepository.update(
      { view: article.view + 1 },
      { where: { id: article.id } },
    );
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
    const { where, limit, offset, include, sortBy, page, perPage } = buildQueryOptions(query, Article)
    const { rows, count } = await this.articlesRepository.findAndCountAll({
      limit,
      offset,
      where,
      include,
      order: sortBy ? this.articlesRepository.sequelize.literal(sortBy) : [],
    });

    const articleIds = rows?.map((article) => article.id) ?? [];
    const likesCount =
      await this.likesService.getLikesCountForAllEntitiesWithIds(
        LikeAbleEntity.ARTICLE,
        articleIds,
      );

    return {
      pagination: {
        count,
        page,
        perPage,
      },
      items: rows ?? [],
      likes: likesCount,
    };
  }

  async findUserArticles(user: IUser, query: IPaginationQueryOptions) {
    const { page, perPage, limit, offset, include } = buildQueryOptions(query, Article);
    include.push({ model: Comment })
    const { rows, count } = await this.articlesRepository.findAndCountAll({
      where: { user_id: user.id },
      include,
      distinct: true,
      limit,
      offset,
    });
    return {
      paginations: { count, page, perPage },
      items: rows ?? [],
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
