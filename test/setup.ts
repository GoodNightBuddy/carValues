// test/setup.ts
import { rm } from 'fs/promises';
import { join } from 'path';
import type { INestApplication } from '@nestjs/common';

beforeEach(async () => {
  const dbName = process.env.DB_NAME ?? 'test.sqlite';
  try {
    await rm(join(__dirname, '..', dbName), { force: true });
  } catch (error) {}
});

afterEach(async () => {
  const app = (global as any).__app as INestApplication | undefined;
  if (app) {
    await app.close(); // closes TypeORM DataSource under the hood
    (global as any).__app = undefined;
  }
});
