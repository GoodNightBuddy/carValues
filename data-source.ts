// data-source.ts
import { DataSource } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ormConfig = require('./ormconfig.js');

export const AppDataSource = new DataSource(ormConfig);
