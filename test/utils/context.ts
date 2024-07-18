import { QueryTypes } from 'sequelize';
import { PoolOptions } from './pool';
import SequelizeManager from './pool';

const format = require('pg-format');

const DEFAULT_OPTS: PoolOptions = {
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  dialect: 'postgres',
};
const sequelizePool = new SequelizeManager();

export class Context {
  constructor(private roleName) {
    this.roleName = roleName;
  }

  static async build(tableNames: string[]) {
    // role name is schema name
    const roleName = 'testschema';

    // Connect to PG as usual
    await sequelizePool.connect(DEFAULT_OPTS);

    // Create a new role
    await sequelizePool.query(
      `CREATE ROLE ${roleName} WITH LOGIN PASSWORD '${roleName}';`,
      { type: QueryTypes.RAW },
    );

    // Create a schema with the same name
    await sequelizePool.query(
      `CREATE SCHEMA ${roleName} AUTHORIZATION ${roleName};`,
      { type: QueryTypes.RAW },
    );

    // Disconnect entirely from PG
    await sequelizePool.close();
    // Connect to PG as the newly created role
    await sequelizePool.connect({
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      username: roleName,
      password: roleName,
      dialect: 'postgres',
    });

    // Run our migrations in the new schema
    for (const tableName of tableNames) {
      await sequelizePool.migrate(tableName, roleName);
      // await sequelizePool.seed({
      //     directory:
      // })
    }

    return new Context(roleName);
  }

  async clean(tableNames: string[]) {
    await sequelizePool.connect({
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      username: this.roleName,
      password: this.roleName,
      dialect: 'postgres',
    });
    for (const tableName of tableNames) {
      await sequelizePool.query(
        `TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE;`,
        { type: QueryTypes.RAW },
      );
    }
  }

  async close() {
    return sequelizePool.end(this.roleName);
  }
}
