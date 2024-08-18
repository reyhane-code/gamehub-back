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
import { TableName } from 'src/enums/database.enum';
import { Game } from './game.model';
import { Publisher } from './publisher.model';

@Table({ tableName: TableName.PUBLISHER_GAMES })
export class PublisherGame extends Model {
  @ForeignKey(() => Game)
  @Column(DataType.INTEGER)
  game_id: number;

  @ForeignKey(() => Publisher)
  @Column(DataType.INTEGER)
  publisher_id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt?: Date | null;

  @DeletedAt
  deletedAt?: Date | null;

  @BeforeUpdate
  static updateTimestamp(instance: PublisherGame) {
    instance.updatedAt = new Date();
  }
}
