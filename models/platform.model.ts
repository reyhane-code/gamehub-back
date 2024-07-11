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

@Table({ tableName: TableName.PLATFORMS })
export class Platform extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  slug: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsToMany(() => Game, 'PlatformGame')
  games: Game[];
 
  @BeforeUpdate
  static updateTimestamp(instance: Platform) {
    instance.updatedAt = new Date();
  }

}
