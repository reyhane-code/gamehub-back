import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Game } from "models/game.model";
import { Like } from "models/like.model";
import { Repository } from "src/enums/database.enum";
import { IUser } from "src/users/interfaces/user.interface";

@Injectable()
export class LikesService {
  constructor(
    @Inject(Repository.LIKES) private likesRepository: typeof Like
  ) {}

  async likeGame(gameId: string, user: IUser) {
    return this.likesRepository.create({ user_id: user.id, game_id: parseInt(gameId) });
  }

  removeLike(gameId: number, user: IUser) {
    return this.likesRepository.destroy({
      where: { game_id: gameId, user_id: user.id },
    });
  }

  async userLikedGames(user: IUser) {
    const games = await this.likesRepository.findAll({
      include: { model: Game },
      where: { user_id: user.id },
    });
    if (!games) {
      throw new NotFoundException("You did not like any game.");
    }
    return games;
  }
}
