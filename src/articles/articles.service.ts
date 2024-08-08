import {
  BadRequestException,
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
import { checkFilesMimetype } from 'src/helpers/image-storage';
import { generateHashKey } from 'src/helpers/file.helper';
import { ArticleFile } from 'models/article_file';
import { fileType } from 'src/enums/file-type.enum';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject(Repository.ARTICLES) private articlesRepository: typeof Article,
    @Inject(Repository.ARTICLE_FILES)
    private articlesFilesRepository: typeof ArticleFile,
  ) {}

  async createArticle(
    body: AddArticleDto,
    user: IUser,
    imageFile?: Express.Multer.File,
  ) {
    try {
      if (imageFile) {
        checkFilesMimetype(imageFile.mimetype);
      }
      const hashKey = generateHashKey(35);

      const article = await this.articlesRepository.create({
        title: body.title,
        content: body.content,
        user_id: user.id,
        image: imageFile ? hashKey : null,
      });

      if (imageFile) {
        await this.saveArticleImageDataToDB(
          imageFile,
          article.id,
          user.id,
          body.imageAlt,
          hashKey,
        );
      }
      return article;
    } catch (error) {
      throw new BadRequestException('Something went wrong!');
    }
  }
  saveArticleImageDataToDB(
    image: Express.Multer.File,
    articleId: number,
    userId: number,
    alt: string,
    hashKey: string,
  ) {
    try {
      return this.articlesFilesRepository.create<ArticleFile>({
        user_id: userId,
        article_id: articleId,
        file_type: fileType.IMAGE,
        meta: {
          size: Number(image.size),
          alt,
          blurHash: '',
        },
        hash_key: hashKey,
      });
    } catch (error) {
      throw new BadRequestException('something went wrong while saving image!');
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
    if (!articles) {
      throw new NotFoundException('No articles were found!');
    }
    return articles;
  }

  async findArticlesWithPaginate({ perPage, page }: IPaginationQueryOptions) {
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
    const articles = await this.articlesRepository.findAll({
      where: { user_id: user.id },
      include: [{ model: Like }, { model: Comment }],
    });
    if (articles.length < 1) {
      throw new NotFoundException('No articles were found!');
    }
    return articles;
  }

  async updateArticle(body: UpdateArticleDto, id: number, user: IUser) {
    await this.findArticleById(id);
    try {
      return this.articlesRepository.update(
        { body },
        { where: { id, user_id: user.id } },
      );
    } catch (error) {
      throw new BadRequestException('Something went wrong!');
    }
  }

  async deleteArticle(id: number, user: IUser, isSoftDelete: boolean) {
    await this.findArticleById(id);
    if (isSoftDelete) {
      return this.articlesRepository.destroy({
        where: { id, user_id: user.id },
      });
    } else {
      return this.articlesRepository.destroy({
        where: { id, user_id: user.id },
        force: true,
      });
    }
  }
}
