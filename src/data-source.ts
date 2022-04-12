import { DataSource } from 'typeorm';
import { UserAuthEntity } from './databaseEntities/UserAuthEntity';
import { EventEntity } from './databaseEntities/EventEntity';
import 'reflect-metadata';

//TODO add correct parameters here

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
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
