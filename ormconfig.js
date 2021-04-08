require('dotenv').config();

const dev = process.env.NODE_ENV === 'dev';
const { DB_HOST, DB_PORT, DB_USERNAME, DB_DATABASE, DB_PASSWORD } = process.env;

module.exports = {
  type: 'postgres',
  host: DB_HOST || 'localhost',
  port: DB_PORT || 5432,
  username: DB_USERNAME || 'postgres',
  password: DB_PASSWORD ||'docker',
  database: DB_DATABASE || 'data',
  entities: dev ? ['./src/modules/**/infra/typeorm/entities/*.ts'] : ['./dist/modules/**/infra/typeorm/entities/*.js'],
  migrations: dev ? ['./src/shared/infra/typeorm/migrations/*.ts'] : ['./src/shared/infra/typeorm/migrations/*.ts'],
  cli: {
    migrationsDir: './src/shared/infra/typeorm/migrations'
  }
}
