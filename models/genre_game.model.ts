import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  BeforeUpdate,
  ForeignKey,
  BelongsTo,
  DeletedAt,
} from 'sequelize-typescript';
import { TableName } from 'src/enums/database.enum';
import { Game } from './game.model';
import { Genre } from './genre.model';

@Table({ tableName: TableName.GENRE_GAMES })
export class GenreGame extends Model {
  @ForeignKey(() => Game)
  @Column(DataType.INTEGER)
  game_id: number;

  @ForeignKey(() => Genre)
  @Column(DataType.INTEGER)
  genre_id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date | null;

  @BeforeUpdate
  static updateTimestamp(instance: GenreGame) {
    instance.updatedAt = new Date();
  }
}
