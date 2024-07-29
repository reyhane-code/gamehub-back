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
import { TableName } from '../src/enums/database.enum';
import { Game } from './game.model';
import { User } from './user.model';
import { Meta } from '../src/interfaces/meta.interface';

@Table({ tableName: TableName.PLATFORM_GAMES })
export class GameFile extends Model {
  @ForeignKey(() => Game)
  @Column(DataType.INTEGER)
  game_id: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id: number;

  @Column(DataType.STRING)
  type: string;

  @Column(DataType.JSONB)
  meta: Meta;

  @Column(DataType.STRING)
  hash_key: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date | null;

  @BeforeUpdate
  static updateTimestamp(instance: GameFile) {
    instance.updatedAt = new Date();
  }
}
