import * as fs from 'fs';
import { AppDataSource } from '../../src/data-source';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../src/databaseEntities/UserEntity';
import { UserAuthEntity } from '../../src/databaseEntities/UserAuthEntity';
import { EventEntity } from '../../src/databaseEntities/EventEntity';
import { InfrastructureEntity } from '../../src/databaseEntities/InfrastructureEntity';

export class TestUtils {
  dbConnection: DataSource;

  constructor() {
    this.dbConnection = AppDataSource;
  }

  async shutdownServer(server) {
    await server.httpServer.close();
    await this.closeDbConnection();
  }

  async connectToDb() {
    try {
      await this.dbConnection.initialize();
    } catch (e) {
      console.log(e);
    }
  }

  async closeDbConnection() {
    const connection = this.dbConnection.isInitialized;
    if (connection) {
      await this.dbConnection.destroy();
    }
  }

  public async dropDb() {
    const connection = this.dbConnection.isInitialized;
    await this.dbConnection.dropDatabase();
  }

  async getEntities() {
    const entities = [];
    this.dbConnection.entityMetadatas.forEach(x =>
      entities.push({ name: x.name, tableName: x.tableName }),
    );
    return entities;
  }

  async reloadFixtures() {
    const entities = await this.getEntities();
    await this.cleanAll();
    await this.loadAll(entities);
  }

  async cleanAll() {
    const entities = [
      UserEntity,
      UserAuthEntity,
      EventEntity,
      InfrastructureEntity,
    ];
    try {
      for (const entity of entities) {
        const repository = await this.dbConnection.getRepository(entity);
        await repository.query(`TRUNCATE TABLE \`${entity}\`;`);
      }
    } catch (error) {
      throw new Error(`ERROR: Cleaning test db: ${error}`);
    }
  }

  async loadAll(entities) {
    try {
      for (const entity of entities) {
        const repository = await this.dbConnection.getRepository(entity.name);
        const fixtureFile = `src/test/fixtures/${entity.name}.json`;
        if (fs.existsSync(fixtureFile)) {
          const items = JSON.parse(fs.readFileSync(fixtureFile, 'utf8'));
          await repository
            .createQueryBuilder(entity.name)
            .insert()
            .values(items)
            .execute();
        }
      }
    } catch (error) {
      throw new Error(
        `ERROR [TestUtils.loadAll()]: Loading fixtures on test db: ${error}`,
      );
    }
  }
}
