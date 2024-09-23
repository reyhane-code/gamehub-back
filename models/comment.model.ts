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
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { TableName } from 'src/enums/database.enum';
import { User } from './user.model';
import { Rate } from 'src/comments/enums/rate.enum';
import { Like } from './like.model';
import { Game } from './game.model';
import { Article } from './article.model';

@Table({ tableName: TableName.COMMENTS })
export class Comment extends Model {
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

  @Column(DataType.TEXT)
  content: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rate: Rate;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  confirmed: boolean

  @ForeignKey(() => Comment)
  @Column({ type: DataType.INTEGER, allowNull: true })
  parent_id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  parent_user_id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt?: Date | null;

  @DeletedAt
  deletedAt?: Date | null;

  @HasMany(() => Like)
  likes: Like[];

  @BelongsTo(() => Game)
  game: Game;

  @BelongsTo(() => Article)
  article: Article;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Comment)
  parent: Comment;

  @BeforeUpdate
  static updateTimestamp(instance: Comment) {
    instance.updatedAt = new Date();
  }
}
