import { DataSource } from 'typeorm';
import { UserAuthEntity } from './databaseEntities/UserAuthEntity';
import { EventEntity } from './databaseEntities/EventEntity';
import dotenv from 'dotenv';
import 'reflect-metadata';

dotenv.config();

//TODO add correct parameters here

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: true,
  entities: [UserAuthEntity, EventEntity],
  subscribers: [],
  migrations: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch(err => {
    console.error('Error during Data Source initialization', err);
  });
