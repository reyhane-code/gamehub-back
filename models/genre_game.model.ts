import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  BeforeUpdate,
} from "sequelize-typescript";
import { TableName } from "src/enums/database.enum";

@Table({ tableName: TableName.GENRE_GAMES })
export class GenreGame extends Model {
  @Column(DataType.INTEGER)
  game_id: number;

  @Column(DataType.INTEGER)
  genre_id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BeforeUpdate
  static updateTimestamp(instance: GenreGame) {
    instance.updatedAt = new Date();
  }
}
