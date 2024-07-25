import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { IGamesQuery } from './interfaces/games.interface';
import { AddGameDto } from './dtos/add-game.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { UpdateGameDto } from './dtos/update-game.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get('/:slug')
  getGame(@Param('slug') slug: string) {
    return this.gamesService.findGameBySlug(slug);
  }

  @Get()
  getGames(@Query() query: IGamesQuery) {
    return this.gamesService.getGames(query);
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
  @Post()
  addGame(@Body() body: AddGameDto, @CurrentUser() user: IUser) {
    return this.gamesService.addGame(body, user);
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  updateGame(@Body() body: UpdateGameDto, @Param('id') id: number) {
    return this.gamesService.updateGame(body, id);
  }
}
