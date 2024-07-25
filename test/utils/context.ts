import { QueryTypes } from 'sequelize';
import SequelizeManager from './pool';

const format = require('pg-format');

const sequelizePool = new SequelizeManager();

export class Context {
  static async build() {
    await sequelizePool.connect({
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      dialect: 'postgres',
      logging: false,
    });

    // await sequelizePool.query(
    //   `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA TO ${process.env.POSTGRES_USER};`,
    //   { type: QueryTypes.RAW },
    // );

    await sequelizePool.authenticateAndSync();

    return new Context();
  }

  async clean(tableNames: string[]) {
    for (const tableName of tableNames) {
      await sequelizePool.query(
        `TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE;`,
        { type: QueryTypes.RAW },
      );
    }
  }

  // async close() {
  //   return sequelizePool.end(process.env.POSTGRES_USER);
  // }
}
