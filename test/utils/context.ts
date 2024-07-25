import { QueryTypes } from 'sequelize';
import SequelizeManager from './pool';

export class Context {
  private sequelizePool: SequelizeManager;

  constructor(sequelizePool) {
    this.sequelizePool = sequelizePool;
  }
  static async build() {
    const sequelizePool: SequelizeManager = new SequelizeManager();
    await sequelizePool.connect({
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      dialect: 'postgres',
      logging: (msg) => {
      },
    });

    // await this.sequelizePool.query(
    //   `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA TO ${process.env.POSTGRES_USER};`,
    //   { type: QueryTypes.RAW },
    // );

    await sequelizePool.authenticateAndSync();

    return new Context(sequelizePool);
  }

  async clean(tableNames: string[]) {
    for (const tableName of tableNames) {
      try {
        await this.query(
          `TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE;`,
        );
      } catch (e) {
        console.log('e', e);
      }
    }
  }

  async query(sql: string) {
    try {
      return this.sequelizePool.query(sql, { type: QueryTypes.RAW });
    } catch (e) {
      console.log('e', e);
    }
  }
  // async close() {
  //   return this.sequelizePool.end(process.env.POSTGRES_USER);
  // }
}
