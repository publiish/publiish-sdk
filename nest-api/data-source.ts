require('dotenv').config();
import { DataSource } from 'typeorm';

const appDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DATABASE_USER,
  //   password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/**/*.entity.{ts,js}'],
  migrations: ['migrations/*.{ts,js}'],
});

export default appDataSource;
