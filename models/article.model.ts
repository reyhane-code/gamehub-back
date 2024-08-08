import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
  HasMany,
  BeforeUpdate,
  DeletedAt,
} from 'sequelize-typescript';
import { TableName } from 'src/enums/database.enum';
import { User } from './user.model';
import { Bookmark } from './bookmark.model';
import { Like } from './like.model';
import { Comment } from './comment.model';

@Table({ tableName: TableName.ARTICLES })
export class Article extends Model {
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  content: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id: number;

  @Column(DataType.STRING)
  image?: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date | null;

  @HasMany(() => Bookmark)
  bookmarks: Bookmark[];

  @HasMany(() => Like)
  likes: Like[];

  @HasMany(() => Comment)
  comments: Comment[];

  @BeforeUpdate
  static updateTimestamp(instance: Article) {
    instance.updatedAt = new Date();
  }
}
