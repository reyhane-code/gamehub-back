import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  BeforeUpdate,
  ForeignKey,
  DeletedAt,
} from 'sequelize-typescript';
import { TableName } from '../src/enums/database.enum';
import { User } from './user.model';
import { Meta } from '../src/interfaces/meta.interface';
import { Article } from './article.model';

@Table({ tableName: TableName.GAME_FILES })
export class ArticleFile extends Model {
  @ForeignKey(() => Article)
  @Column(DataType.INTEGER)
  article_id: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id: number;

  @Column(DataType.STRING)
  file_type: string;

  @Column(DataType.JSONB)
  meta: Meta;

  @Column(DataType.STRING)
  hash_key: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date | null;

  @BeforeUpdate
  static updateTimestamp(instance: ArticleFile) {
    instance.updatedAt = new Date();
  }
}
