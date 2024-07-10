import {
    Column,
    Model,
    Table,
    CreatedAt,
    UpdatedAt,
    DataType,
    BeforeUpdate,
  } from "sequelize-typescript";
  import { TableName } from "src/enums/database.enum";
  
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
  }
  