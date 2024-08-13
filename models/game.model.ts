import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  BeforeUpdate,
  BelongsToMany,
  DeletedAt,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { TableName } from 'src/enums/database.enum';
import { Genre } from './genre.model';
import { Platform } from './platform.model';
import { Publisher } from './publisher.model';
import { GenreGame } from './genre_game.model';
import { PlatformGame } from './platform_game.model';
import { PublisherGame } from './publisher_game.model';
import { User } from './user.model';
import { Like } from './like.model';
import { Comment } from './comment.model';
import { Bookmark } from './bookmark.model';
import { Screenshot } from './screenshot.model';

@Table({ tableName: TableName.GAMES })
export class Game extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  slug: string;

  @Column({ type: DataType.STRING, allowNull: true })
  background_image: string;

  @Column({ type: DataType.STRING, allowNull: true })
  rating_top: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  metacritic: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date | null;

  @HasMany(() => Like)
  likes: Like[];

  @HasMany(() => Screenshot)
  screenshots: Screenshot[];

  @HasMany(() => Comment)
  comments: Comment[];

  @HasMany(() => Bookmark)
  bookmarks: Bookmark[];

  @BelongsToMany(() => Genre, () => GenreGame)
  genres: Genre[];

  @BelongsToMany(() => Platform, () => PlatformGame)
  platforms: Platform[];

  @BelongsToMany(() => Publisher, () => PublisherGame)
  publishers: Publisher[];

  @BeforeUpdate
  static updateTimestamp(instance: Game) {
    instance.updatedAt = new Date();
  }
}
