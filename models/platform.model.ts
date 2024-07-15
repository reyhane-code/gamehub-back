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
import { PlatformGame } from './platform_game.model';
import { User } from './user.model';

@Table({ tableName: TableName.PLATFORMS })
export class Platform extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  slug: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date | null;

  @BelongsToMany(() => Game, () => PlatformGame)
  games: Game[];

  @BeforeUpdate
  static updateTimestamp(instance: Platform) {
    instance.updatedAt = new Date();
  }
}
