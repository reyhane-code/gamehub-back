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
import { GenreGame } from './genre_game.model';

@Table({ tableName: TableName.GENRES })
export class Genre extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BeforeUpdate
  static updateTimestamp(instance: Genre) {
    instance.updatedAt = new Date();
  }
  @BelongsToMany(() => Game, ()=> GenreGame)
  games: Game[];
}
