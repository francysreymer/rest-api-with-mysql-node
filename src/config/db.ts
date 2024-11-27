import dotenvSafe from 'dotenv-safe';
import { DataSource } from 'typeorm';

import { User } from '@/entities/User';

dotenvSafe.config({
  allowEmptyValues: true,
});

export const db = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_ROOT_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
