import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AddArticleDto } from './dtos/add-article.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { IUser } from 'src/users/interfaces/user.interface';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { FileFieldsFastifyInterceptor } from 'fastify-file-interceptor';
import { multerOptions } from '../helpers/file/multer-options';
import { paginationDefault } from 'src/constance';

@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsFastifyInterceptor(
      [{ name: 'image', maxCount: 1 }],
      multerOptions,
    ),
  )
  @Post()
  createArticle(
    @Body() body: AddArticleDto,
    @CurrentUser() user: IUser,
    @UploadedFiles()
    image?: { image?: Express.Multer.File[] },
  ) {
    const imageFile = image?.image ? image.image[0] : null;
    return this.articlesService.createArticle(body, user, imageFile);
  }

  @Get()
  getArticles() {
    return this.articlesService.findArticles();
  }

  @Get('/paginate')
  getArticlesWithPaginate(
    @Query() query: IPaginationQueryOptions = paginationDefault,
  ) {
    return this.articlesService.findArticlesWithPaginate(query);
  }

  @Get('/:id')
  getArticleById(@Param('id') id: number) {
    return this.articlesService.findArticleById(id);
  }

  @Get('find/:title')
  getArticleByTitle(@Param('title') title: string) {
    return this.articlesService.findArticleByTitle(title);
  }

  @UseGuards(AuthGuard)
  @Get('/user')
  getUserArticles(@CurrentUser() user: IUser) {
    return this.articlesService.findUserArticles(user);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  updateArticle(
    @Body() body: UpdateArticleDto,
    @Param('id') id: number,
    @CurrentUser() user: IUser,
  ) {
    return this.articlesService.updateArticle(body, id, user);
  }
  @UseGuards(AuthGuard)
  @Delete('/:id')
  deleteArticle(
    @Param('id') id: number,
    @Query() isSoftDelete: boolean = true,
    @CurrentUser() user: IUser,
  ) {
    return this.articlesService.deleteArticle(id, isSoftDelete, user);
  }
}
