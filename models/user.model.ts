import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  HasMany,
  BeforeUpdate,
  DeletedAt,
} from 'sequelize-typescript';
import { TableName } from 'src/enums/database.enum';
import { Game } from './game.model';
import { Like } from './like.model';

@Table({ tableName: TableName.USERS })
export class User extends Model {
  @Column({ type: DataType.STRING, unique: true })
  username: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  phone: string;

  @Column({ type: DataType.STRING, unique: true })
  email: string;

  @Column(DataType.STRING)
  password: string;

  @Column(DataType.STRING)
  first_name: string;

  @Column(DataType.STRING)
  last_name: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  active: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date | null;

  @HasMany(() => Game)
  games: Game[];

  @HasMany(() => Like)
  likes: Like[];

  @BeforeUpdate
  static updateTimestamp(instance: User) {
    instance.updatedAt = new Date();
  }
}
