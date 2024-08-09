import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  BeforeUpdate,
  DeletedAt,
} from 'sequelize-typescript';
import { TableName } from '../src/enums/database.enum';
import { Meta } from '../src/interfaces/meta.interface';

@Table({ tableName: TableName.FILES })
export class File extends Model {
  @Column(DataType.STRING)
  file_type: string;

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
  static updateTimestamp(instance: File) {
    instance.updatedAt = new Date();
  }
}
