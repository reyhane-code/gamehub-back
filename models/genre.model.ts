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
import { GenreGame } from './genre_game.model';
import { User } from './user.model';

@Table({ tableName: TableName.GENRES })
export class Genre extends Model {
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

  @BeforeUpdate
  static updateTimestamp(instance: Genre) {
    instance.updatedAt = new Date();
  }
  @BelongsToMany(() => Game, () => GenreGame)
  games: Game[];
}
