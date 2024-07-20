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
import { GenresService } from './genres.service';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { AdminGuard } from 'src/guards/admin.guard';
import { AddGenreDto } from './dtos/add-genre.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { IUser } from 'src/users/interfaces/user.interface';
import { UpdateGenreDto } from './dtos/update-genre.dto';
import { paginationDefault } from 'src/constance';

@Controller('genres')
export class GenresController {
  constructor(private genresService: GenresService) {}

  @Get('/:id')
  findGenre(@Param('id') id: number) {
    return this.genresService.findOneById(id);
  }

  @Get()
  findGenres() {
    return this.genresService.findAll();
  }

  @Get('/paginate')
  findGenresWithPaginate(
    @Query() query: IPaginationQueryOptions = paginationDefault,
  ) {
    return this.genresService.findAllWithPaginate(query);
  }

  @UseGuards(AdminGuard)
  @Get('/user')
  getUserGenres(@CurrentUser() user: IUser) {
    return this.genresService.findUserGenres(user);
  }

  @UseGuards(AdminGuard)
  @Post()
  addGenre(@Body() body: AddGenreDto, @CurrentUser() user: IUser) {
    return this.genresService.addGenre(body, user);
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  updateGenre(@Param('id') id: number, @Body() body: UpdateGenreDto) {
    return this.genresService.updateGenre(id, body);
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  deleteGenre(@Param('id') id: number, @Query() isSoftDelete: boolean = true) {
    return this.genresService.deleteGenre(id, isSoftDelete);
  }
}
