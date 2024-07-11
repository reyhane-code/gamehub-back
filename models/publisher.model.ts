import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  BeforeUpdate,
  BelongsToMany,
} from 'sequelize-typescript';
import { TableName } from 'src/enums/database.enum';
import { Game } from './game.model';

@Table({ tableName: TableName.PUBLISHERS })
export class Publisher extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsToMany(() => Game, 'PublisherGame')
  games: Game[];

  @BeforeUpdate
  static updateTimestamp(instance: Publisher) {
    instance.updatedAt = new Date();
  }
}
