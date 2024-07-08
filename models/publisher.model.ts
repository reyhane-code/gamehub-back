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

@Table({ tableName: TableName.PUBLISHERS })
export class Publisher extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BeforeUpdate
  static updateTimestamp(instance: Publisher) {
    instance.updatedAt = new Date();
  }
}
