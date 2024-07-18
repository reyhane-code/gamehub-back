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
import { getGamesQuery } from './interfaces/games.interface';
import { AddGameDto } from './dtos/add-game.dto';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { UpdateGameDto } from './dtos/update-game.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { AdminGuard } from 'src/guards/admin.guard';
import { SearchFilterOptions } from 'src/interfaces/database.interfaces';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get('/:id')
  getGame(@Param('id') id: number) {
    return this.gamesService.findOneById(id);
  }

  @Get('/:search?/:filter?')
  getGames(
    @Query() query: getGamesQuery,
    @Param('search') search?: SearchFilterOptions[],
    @Param('filter') filter?: SearchFilterOptions[],
  ) {
    return this.gamesService.getGames(query,search,filter);
  }

  @UseGuards(AdminGuard)
  @Get('/user')
  getUserGames(@CurrentUser() user: UserInterface) {
    return this.gamesService.findUserGames(user);
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  deleteGame(@Param('id') id: number, @Query() isSoftDelete: boolean = true) {
    return this.gamesService.deleteGame(id, isSoftDelete);
  }

  @UseGuards(AdminGuard)
  @Post()
  addGame(@Body() body: AddGameDto, @CurrentUser() user: UserInterface) {
    return this.gamesService.addGame(body, user);
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  updateGame(@Body() body: UpdateGameDto, @Param('id') id: number) {
    return this.gamesService.updateGame(body, id);
  }
}
