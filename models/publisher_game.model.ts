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

@Table({ tableName: TableName.PUBLISHER_GAMES })
export class PublisherGame extends Model {
  @Column(DataType.INTEGER)
  game_id: number;

  @Column(DataType.INTEGER)
  publisher_id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BeforeUpdate
  static updateTimestamp(instance: PublisherGame) {
    instance.updatedAt = new Date();
  }
}
