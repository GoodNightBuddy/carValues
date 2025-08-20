// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const config = {
  entities: [path.join(__dirname, '**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, 'migrations/*.{ts,js}')],
  synchronize: false,
};

switch (process.env.NODE_ENV) {
  case 'test':
    Object.assign(config, {
      type: 'sqlite',
      database: 'test.sqlite',
      // for tests you can let TypeORM auto-create schema:
      // synchronize: true,
      migrationsRun: true,
      dropSchema: true, // clean DB per run
    });
    break;

  case 'development':
    Object.assign(config, {
      type: 'sqlite',
      database: 'db.sqlite',
      synchronize: false, // use migrations in dev if you want
    });
    break;

  case 'production':
    Object.assign(config, {
      type: 'postgres',
      url: process.env.DATABASE_URL, // Render gives you this
      synchronize: false,
      migrationsRun: true,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    break;

  default:
    throw new Error("NODE_ENV isn't defined");
}

module.exports = config;
