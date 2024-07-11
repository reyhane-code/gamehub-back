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
import { Genre } from './genre.model';
import { Platform } from './platform.model';
import { Publisher } from './publisher.model';

@Table({ tableName: TableName.GAMES })
export class Game extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  slug: string;

  @Column({ type: DataType.STRING, allowNull: false })
  background_image: string;

  @Column({ type: DataType.STRING, allowNull: false })
  rating_top: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  metacritic: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsToMany(() => Genre, 'GenreGame')
  genres: Genre[];

  @BelongsToMany(() => Platform, 'PlatformGame')
  platforms: Platform[];

  @BelongsToMany(() => Publisher, 'PublisherGame')
  publishers: Publisher[];
 
  @BeforeUpdate
  static updateTimestamp(instance: Game) {
    instance.updatedAt = new Date();
  }
}
