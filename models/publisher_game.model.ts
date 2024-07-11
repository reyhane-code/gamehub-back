import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  BeforeUpdate,
  ForeignKey,
  HasMany,
  BelongsTo,
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
  updatedAt: Date;

  @BelongsTo(() => Game)
  game: Game;

  @BelongsTo(() => Publisher)
  publisher: Publisher;
  
  @BeforeUpdate
  static updateTimestamp(instance: PublisherGame) {
    instance.updatedAt = new Date();
  }
}
