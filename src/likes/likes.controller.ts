import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { LikesService } from "./likes.service";
import { AuthGuard } from "../guards/auth.guard";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import { UserInterface } from "src/users/interfaces/user.interface";

@Controller("like")
export class LikesController {
  constructor(private likesService: LikesService) {}

  @UseGuards(AuthGuard)
  @Post("/:id")
  likeGame(@Param("id") id: number, @CurrentUser() user: UserInterface) {
    return this.likesService.likeGame(id, user);
  }

  @UseGuards(AuthGuard)
  @Delete("/:id")
  removeLike(@Param("id") id: number, @CurrentUser() user: UserInterface) {
    return this.likesService.removeLike(id, user);
  }

  @UseGuards(AuthGuard)
  @Get("/user")
  getUserLikedGames(@CurrentUser() user: UserInterface) {
    return this.likesService.userLikedGames(user);
  }
}
