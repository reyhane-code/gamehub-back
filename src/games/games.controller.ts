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
import { GamesService } from './games.service';
import { AddGameDto } from './dtos/add-game.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { UpdateGameDto } from './dtos/update-game.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { AdminGuard } from 'src/guards/admin.guard';
import { FileFieldsFastifyInterceptor } from 'fastify-file-interceptor';
import { multerOptions } from 'src/helpers/file/multer-options';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) { }

  @Get('/:slug')
  getGame(@Param('slug') slug: string) {
    return this.gamesService.findGameBySlug(slug);
  }

  @Get()
  findGamesWithPaginate(@Query() query: IPaginationQueryOptions) {
    return this.gamesService.findGamesWithPaginate(query);
  }

  @Get('/all')
  findAllGames(@Query() query: IPaginationQueryOptions) {
    return this.gamesService.findAllGames(query);
  }

  @UseGuards(AdminGuard)
  @Get('/user')
  getUserGames(@CurrentUser() user: IUser) {
    return this.gamesService.findUserGames(user);
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  deleteGame(@Param('id') id: number, @Query() isSoftDelete: boolean = true) {
    return this.gamesService.deleteGame(id, isSoftDelete);
  }

  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileFieldsFastifyInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'screenshots', maxCount: 12 },
      ],
      multerOptions,
    ),
  )
  @Post()
  addGame(
    @Body() body: AddGameDto,
    @CurrentUser() user: IUser,
    @UploadedFiles()
    files?: {
      image?: Express.Multer.File[];
      screenshots?: Express.Multer.File[];
    },
  ) {
    const imageFile = files?.image ? files.image[0] : null;
    const screenshots = files?.screenshots ? files.screenshots : null;
    return this.gamesService.addGame(body, user, imageFile, screenshots);
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  updateGame(@Body() body: UpdateGameDto, @Param('id') id: number) {
    return this.gamesService.updateGame(body, id);
  }
}
