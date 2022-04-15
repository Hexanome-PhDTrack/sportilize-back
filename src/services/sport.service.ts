import { SportEntity } from '../databaseEntities/SportEntity';
import { DataSource, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';

class SportService {
  public dbConnection: DataSource;
  public sportRepo: Repository<SportEntity>;

  constructor() {
    this.dbConnection = AppDataSource;
    this.sportRepo = this.dbConnection.getRepository(SportEntity);
  }

  public async getSport(name: string): Promise<SportEntity> {
    const sport: SportEntity = await this.sportRepo.findOne({
      where: { name: name },
    });

    return sport;
  }
}

export default SportService;
