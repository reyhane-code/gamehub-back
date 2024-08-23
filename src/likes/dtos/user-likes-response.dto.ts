import { Exclude, Expose } from 'class-transformer';
import { Article } from 'models/article.model';
import { Comment } from 'models/comment.model';
import { Game } from 'models/game.model';

export class UserLikesResponseDto {
  @Expose()
  game?: Game;

  @Expose()
  article?: Article;

  @Expose()
  comment?: Comment;

  @Exclude()
  game_id?: number;

  @Exclude()
  article_id?: number;

  @Exclude()
  comment_id?: number;

  @Exclude()
  entity_type: string;

  @Exclude()
  id: number;
  constructor(partial: Partial<UserLikesResponseDto>) {
    Object.assign(this, partial);
  }
}
