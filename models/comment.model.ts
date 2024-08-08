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

  @ForeignKey(() => Comment)
  @Column({ type: DataType.INTEGER, allowNull: true })
  parent_id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date | null;

  @HasMany(() => Like)
  likes: Like[];

  @BeforeUpdate
  static updateTimestamp(instance: Comment) {
    instance.updatedAt = new Date();
  }
}
