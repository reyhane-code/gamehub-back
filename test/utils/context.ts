import { QueryTypes } from 'sequelize';
import SequelizeManager from './pool';

export class Context {
  private static instance: Context;
  private sequelizePool: SequelizeManager;

  private constructor() {
    this.sequelizePool = SequelizeManager.getInstance();
  }

  public static async getInstance(): Promise<Context> {
    if (!Context.instance) {
      Context.instance = new Context();
      await Context.instance.build();
    }
    return Context.instance;
  }

  private async build(): Promise<void> {
    await this.sequelizePool.connect({
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      dialect: 'postgres',
      logging: (msg) => {},
    });

    // await this.query(
    //   `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA TO ${process.env.POSTGRES_USER};`,
    //   { type: QueryTypes.RAW },
    // );

    await this.sequelizePool.authenticateAndSync();
  }

  public async clean(tableNames: string[]): Promise<void> {
    for (const tableName of tableNames) {
      try {
        await this.query(
          `TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE;`,
        );
      } catch (e) {
        // console.log('e', e);
      }
    }
  }

  public async query(sql: string): Promise<any> {
    try {
      return this.sequelizePool.query(sql, { type: QueryTypes.RAW });
    } catch (e) {
      if (!sql.includes('TRUNCATE TABLE')) {
        console.log('error run context query : ', e);
      }
    }
  }

  // public async close() {
  //   return this.sequelizePool.end(process.env.POSTGRES_USER);
  // }
}
