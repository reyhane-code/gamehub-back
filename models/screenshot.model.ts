import {
  BeforeUpdate,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { TableName } from 'src/enums/database.enum';
import { Game } from './game.model';

@Table({ tableName: TableName.SCREENSHOTS })
export class Screenshot extends Model {
  @ForeignKey(() => Game)
  @Column(DataType.INTEGER)
  game_id: number;

  @Column(DataType.STRING)
  hash_key: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date | null;

  @BeforeUpdate
  static updateTimestamp(instance: Screenshot) {
    instance.updatedAt = new Date();
  }
}
