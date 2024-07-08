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

@Table({ tableName: TableName.PLATFORM_GAMES })
export class PlatformGame extends Model {
  @Column(DataType.INTEGER)
  game_id: number;

  @Column(DataType.INTEGER)
  platform_id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BeforeUpdate
  static updateTimestamp(instance: PlatformGame) {
    instance.updatedAt = new Date();
  }
}
