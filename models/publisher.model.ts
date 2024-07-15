import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  BeforeUpdate,
  BelongsToMany,
  DeletedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { TableName } from 'src/enums/database.enum';
import { Game } from './game.model';
import { PublisherGame } from './publisher_game.model';
import { User } from './user.model';

@Table({ tableName: TableName.PUBLISHERS })
export class Publisher extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date | null;

  @BelongsToMany(() => Game, () => PublisherGame)
  games: Game[];

  @BeforeUpdate
  static updateTimestamp(instance: Publisher) {
    instance.updatedAt = new Date();
  }
}
