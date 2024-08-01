import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { IUser } from 'src/users/interfaces/user.interface';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @UseGuards(AuthGuard)
  @Post('/:id')
  likeGame(@Param('id') id: string, @CurrentUser() user: IUser) {
    return this.likesService.likeGame(id, user);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  removeLike(@Param('id') id: number, @CurrentUser() user: IUser) {
    return this.likesService.removeLike(id, user);
  }

  @UseGuards(AuthGuard)
  @Get('/user')
  getUserLikedGames(@CurrentUser() user: IUser) {
    return this.likesService.userLikedGames(user);
  }
}
