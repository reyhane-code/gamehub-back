import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
  BeforeUpdate,
  DeletedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { TableName } from 'src/enums/database.enum';
import { User } from './user.model';
import { Game } from './game.model';
import { Article } from './article.model';

@Table({ tableName: TableName.BOOKMARKS })
export class Bookmark extends Model {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id: number;

  @ForeignKey(() => Game)
  @Column(DataType.INTEGER)
  game_id: number;

  @ForeignKey(() => Article)
  @Column(DataType.INTEGER)
  article_id: number;

  @Column(DataType.STRING)
  entity_type: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt?: Date | null;

  @DeletedAt
  deletedAt?: Date | null;

  @BelongsTo(() => Game)
  game: Game;

  @BelongsTo(() => Article)
  article: Article;

  @BeforeUpdate
  static updateTimestamp(instance: Bookmark) {
    instance.updatedAt = new Date();
  }
}
