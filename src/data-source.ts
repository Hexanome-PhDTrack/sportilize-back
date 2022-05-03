import { DataSource } from 'typeorm';
import { UserAuthEntity } from './databaseEntities/UserAuthEntity';
import { EventEntity } from './databaseEntities/EventEntity';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { UserEntity } from './databaseEntities/UserEntity';
import { InfrastructureEntity } from './databaseEntities/InfrastructureEntity';
import { SportEntity } from './databaseEntities/SportEntity';

dotenv.config();

//TODO add correct parameters here

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true, //TODO don't forget this on prod
  logging: true,
  entities: [
    UserEntity,
    UserAuthEntity,
    EventEntity,
    InfrastructureEntity,
    SportEntity,
  ],
  subscribers: [],
  migrations: [],
  extra: {
    connectionLimit: 2,
  },
});
