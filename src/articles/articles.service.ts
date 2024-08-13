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
import { Repository } from 'src/enums/database.enum';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { Like } from 'models/like.model';
import { Comment } from 'models/comment.model';
import { paginationDefault } from 'src/constance';
import { File } from 'models/file.model';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject(Repository.ARTICLES) private articlesRepository: typeof Article,
    private readonly filesService: FilesService,
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
      include: [{ model: Like }, { model: Comment }],
    });
    if (!article) {
      throw new NotFoundException('No article was found!');
    }
    return article;
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
      include: [{ model: Like }, { model: Comment }],
    });
    if (articles.length < 1 || !articles) {
      throw new NotFoundException('No articles were found!');
    }
    return articles;
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
    const page = query.page || paginationDefault.page;
    const perPage = query.perPage || paginationDefault.perPage;

    const { count, rows } = await this.articlesRepository.findAndCountAll({
      limit: perPage,
      offset: perPage * (page - 1),
      include: [{ model: Like }, { model: Comment }],
      distinct: true,
    });
    if (count < 1) {
      throw new NotFoundException('No articles was found!');
    }
    return {
      count,
      data: rows,
      page,
      perPage,
      offset: (page - 1) * perPage,
    };
  }

  async findUserArticles(user: IUser) {
    const { rows, count } = await this.articlesRepository.findAndCountAll({
      where: { user_id: user.id },
      include: [{ model: Like }, { model: Comment }],
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
