import { QueryTypes, Sequelize } from 'sequelize';
export interface IPoolOptions {
  database: string;
  username: string;
  password: string;
  host: string;
  dialect: 'postgres';
  logging: (msg: string) => void;
}

export default class SequelizeManager {
  private static instance: SequelizeManager;
  private sequelize: Sequelize;

  private constructor() {}

  public static getInstance(): SequelizeManager {
    if (!SequelizeManager.instance) {
      SequelizeManager.instance = new SequelizeManager();
    }
    return SequelizeManager.instance;
  }

  async authenticateAndSync() {
    await this.sequelize.authenticate();
    await this.sequelize.sync();
  }

  async connect(options: IPoolOptions) {
    try {
      this.sequelize = new Sequelize(
        options.database,
        options.username,
        options.password,
        {
          ...options,
        },
      );
      await this.authenticateAndSync();
      console.log('Connection to database has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  async close() {
    await this.sequelize.close();
  }

  async query(sql: string, options?: { type: QueryTypes }): Promise<any> {
    try {
      const result = await this.sequelize.query(sql, {
        type: options?.type || QueryTypes.SELECT,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // async migrate(pathToMigrationFile: string, schemaName: string) {
  //   const queryInterface = this.sequelize.getQueryInterface();
  //   const migrationModule = require(join(process.cwd(), pathToMigrationFile));
  //   try {
  //     await migrationModule.up(queryInterface, this.sequelize, schemaName);
  //     console.log('Migration successful');
  //   } catch (error) {
  //     console.error('Error running migration:', migrationModule);
  //   }
  // }

  // async seed(pathToSeedFile: string) {
  //   try {
  //     const seedScript = fs.readFileSync(
  //       join(process.cwd(), pathToSeedFile),
  //       'utf8',
  //     );
  //     await this.sequelize.query(seedScript);
  //     console.log('Seed successful');
  //   } catch (error) {
  //     console.error('Error running seed script:', error);
  //   }
  // }

  // async end(roleName: string) {
  //   try {
  //     await this.authenticateAndSync()

  //     await this.sequelize.query(`DROP SCHEMA ${roleName} CASCADE;`, {
  //       type: QueryTypes.RAW,
  //     });
  //     await this.sequelize.query(`DROP ROLE ${roleName};`, {
  //       type: QueryTypes.RAW,
  //     });

  //     await this.sequelize.close();
  //   } catch (error) {
  //     console.error('Error closing context:', error);
  //     throw error;
  //   }
  // }
}
