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
import { AddArticleDto } from './dtos/add-article.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { IUser } from 'src/users/interfaces/user.interface';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { FileFieldsFastifyInterceptor } from 'fastify-file-interceptor';
import { multerOptions } from '../helpers/file/multer-options';
import { paginationDefault } from 'src/constance';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) { }

  @UseInterceptors(
    FileFieldsFastifyInterceptor(
      [{ name: 'image', maxCount: 1 }],
      multerOptions,
    ),
  )
  @UseGuards(AdminGuard)
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

  @Get('/all')
  getArticles(
    @Query() query: IPaginationQueryOptions = paginationDefault,

  ) {
    return this.articlesService.findArticles(query);
  }

  @Get('/paginate')
  getArticlesWithPaginate(
    @Query() query: IPaginationQueryOptions = paginationDefault,
  ) {
    return this.articlesService.findArticlesWithPaginate(query);
  }

  //adds to view
  @Get('/:id')
  getArticleById(@Param('id') id: number) {
    return this.articlesService.findArticleById(id);
  }

  //does not add to view
  @Get('/admin/:id')
  getArticle(@Param('id') id: number) {
    return this.articlesService.findArticle(id);
  }

  @UseGuards(AdminGuard)
  @Get('/user')
  getUserArticles(
    @CurrentUser() user: IUser,
    @Query() query: IPaginationQueryOptions = paginationDefault,
  ) {
    return this.articlesService.findUserArticles(user, query);
  }

  @UseInterceptors(
    FileFieldsFastifyInterceptor(
      [{ name: 'image', maxCount: 1 }],
      multerOptions,
    ),
  )
  @UseGuards(AdminGuard)
  @Put('/:id')
  updateArticle(
    @Body() body: UpdateArticleDto,
    @Param('id') id: number,
    @CurrentUser() user: IUser,
    @UploadedFiles()
    image?: { image?: Express.Multer.File[] },
  ) {
    const imageFile = image?.image ? image.image[0] : null;
    return this.articlesService.updateArticle(body, id, user, imageFile);
  }
  @UseGuards(AdminGuard)
  @Delete('/:id')
  deleteArticle(
    @Param('id') id: number,
    @Query() isSoftDelete: boolean = true,
    @CurrentUser() user: IUser,
  ) {
    return this.articlesService.deleteArticle(id, isSoftDelete, user);
  }
}
