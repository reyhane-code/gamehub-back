import fs from 'fs';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

export interface PoolOptions {
  database: string;
  username: string;
  password: string;
  host: string;
  dialect: 'postgres';
}

export default class SequelizeManager {
  private sequelize: Sequelize;

  constructor() {}

  async connect(options: PoolOptions) {
    try {
      this.sequelize = new Sequelize(options);
      await this.sequelize.authenticate();
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
      console.error('Error executing query:', error);
      throw error;
    }
  }
  async migrate(pathToMigrationFile: string, schemaName: string) {
    try {
      const queryInterface = this.sequelize.getQueryInterface();
      const migrationModule = require(pathToMigrationFile);
      await migrationModule.up(queryInterface, this.sequelize, schemaName);
      console.log('Migration successful');
    } catch (error) {
      console.error('Error running migration:', error);
    }
  }

  async seed(pathToSeedFile: string) {
    try {
      const seedScript = fs.readFileSync(pathToSeedFile, 'utf8');
      await this.sequelize.query(seedScript);
      console.log('Seed successful');
    } catch (error) {
      console.error('Error running seed script:', error);
    }
  }

  async end(roleName: string) {
    try {
      await this.sequelize.close();
      await this.sequelize.authenticate();

      await this.sequelize.query(`DROP SCHEMA ${roleName} CASCADE;`, {
        type: QueryTypes.RAW,
      });
      await this.sequelize.query(`DROP ROLE ${roleName};`, {
        type: QueryTypes.RAW,
      });

      await this.sequelize.close();
    } catch (error) {
      console.error('Error closing context:', error);
      throw error;
    }
  }
}
