import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
  BeforeUpdate,
  DeletedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { TableName } from 'src/enums/database.enum';
import { User } from './user.model';
import { Game } from './game.model';

@Table({ tableName: TableName.LIKES })
export class Like extends Model {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id: number;

  @ForeignKey(() => Game)
  @Column(DataType.INTEGER)
  game_id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date | null;

  @BelongsTo(() => Game)
  game: Game;

  @BeforeUpdate
  static updateTimestamp(instance: Like) {
    instance.updatedAt = new Date();
  }
}
