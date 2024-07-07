const format = require('pg-format');
import KnexPool from './pool'

const DEFAULT_OPTS = {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: 5432,
}
const knexPool = new KnexPool()

export class Context {

    constructor(private roleName) {
        this.roleName = roleName;
    }

    static async build(tableNames: string[]) {
        // role name is schema name
        const roleName = 'testschema'

        // Connect to PG as usual
        await knexPool.connect(DEFAULT_OPTS);

        // Create a new role
        await knexPool.query(
            format('CREATE ROLE %I WITH LOGIN PASSWORD %L;', roleName, roleName)
        );

        // Create a schema with the same name
        await knexPool.query(
            format('CREATE SCHEMA %I AUTHORIZATION %I;', roleName, roleName)
        );

        // Disconnect entirely from PG
        await knexPool.close();

        // Run our migrations in the new schema
        for (const tableName of tableNames) {
            await knexPool.migrate('schema' + roleName, {
                schemaName: roleName,
                tableName,
                database: process.env.POSTGRES_DB,
            });

            // await knexPool.seed({
            //     directory: 
            // })
        }

        // Connect to PG as the newly created role
        await knexPool.connect({
            database: process.env.POSTGRES_DB,
            host: process.env.POSTGRES_HOST,
            port: 5432,
            user: roleName,
            password: roleName,
        });

        return new Context(roleName);
    }

    async clean(tableNames: string[]) {
        for (const tableName of tableNames) {
            await knexPool.query(format('TRUNCATE TABLE %I RESTART IDENTITY CASCADE;', tableName))
        }
    }

    async close() {
        // Disconnect from PG
        await knexPool.close();

        // Reconnect as our root user
        await knexPool.connect(DEFAULT_OPTS);

        // Delete the role and schema we created
        await knexPool.query(format('DROP SCHEMA %I CASCADE;', this.roleName));
        await knexPool.query(format('DROP ROLE %I;', this.roleName));

        // Disconnect
        await knexPool.close();
    }
}