// Update with your config settings.
const env = require('dotenv').config({path: '../.env'}).parsed;
const {DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME} = env;
module.exports = {
  development: {
    client: DB_TYPE,
    connection: {
      host:     DB_HOST,
      port:     DB_PORT,
      user:     DB_USER,
      password: DB_PASS,
      database: DB_NAME
    },
    migrations: {
      directory: 'databases/migrations',
      tableName: 'migrations'
    },
    seeds: {
      directory: 'databases/seeds',
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: DB_TYPE,
    connection: {
      host:     DB_HOST,
      user:     DB_USER,
      password: DB_PASS,
      database: DB_NAME
    },
    migrations: {
      directory: 'databases/migrations',
      tableName: 'migrations'
    },
    seeds: {
      directory: 'databases/seeds',
    }
  }
};
