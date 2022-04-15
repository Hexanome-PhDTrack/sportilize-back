import { InfrastructureEntity } from '../databaseEntities/InfrastructureEntity';
import { DataSource, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';

class InfrastructureService {
  public dbConnection: DataSource;
  public infrastructureRepo: Repository<InfrastructureEntity>;

  constructor() {
    this.dbConnection = AppDataSource;
    this.infrastructureRepo =
      this.dbConnection.getRepository(InfrastructureEntity);
  }

  public async getInfrastructure(id: number): Promise<InfrastructureEntity> {
    const infra: InfrastructureEntity = await this.infrastructureRepo.findOne({
      where: { id: id },
    });

    return infra;
  }
}

export default InfrastructureService;
