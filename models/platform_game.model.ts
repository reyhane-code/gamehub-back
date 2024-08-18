import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  BeforeUpdate,
  HasMany,
  ForeignKey,
  BelongsTo,
  DeletedAt,
} from 'sequelize-typescript';
import { TableName } from 'src/enums/database.enum';
import { Game } from './game.model';
import { Platform } from './platform.model';

@Table({ tableName: TableName.PLATFORM_GAMES })
export class PlatformGame extends Model {
  @ForeignKey(() => Game)
  @Column(DataType.INTEGER)
  game_id: number;

  @ForeignKey(() => Platform)
  @Column(DataType.INTEGER)
  platform_id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt?: Date | null;

  @DeletedAt
  deletedAt?: Date | null;

  @BeforeUpdate
  static updateTimestamp(instance: PlatformGame) {
    instance.updatedAt = new Date();
  }
}
