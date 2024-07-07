import knex, { Knex } from 'knex';


export default class KnexPool {
    _pool = null as Knex;

    connect(options) {
        this._pool = knex({
            ...options,
            client: 'pg',
            version: '8.7.3',
            connection: {
                ...options,
                host: process.env.POSTGRES_HOST,
                user: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
            },
        });
        return this._pool.raw('SELECT 1 + 1;');
    }

    close() {
        return this._pool.destroy();
    }

    query(sql, params = []) {
        return this._pool.raw(sql, params);
    }
    migrate(name: string, config: Knex.MigratorConfig) {
        this._pool.migrate.make(name, config)
    }

    seed(config: Knex.SeederConfig) {
        this._pool.seed.run(config)
    }
}