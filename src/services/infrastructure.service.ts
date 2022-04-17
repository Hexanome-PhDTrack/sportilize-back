import { InfrastructureEntity } from '../databaseEntities/InfrastructureEntity';
import { DataSource, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Point } from 'geojson';

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

  /**
   *
   * @param positionRef
   * @param distance in meter
   * @param closed
   * @returns
   */
  public async getEventsByArea(
    positionRef: Point,
    distance: number,
  ): Promise<InfrastructureEntity> {
    // https://aaronfrancis.com/2021/efficient-distance-querying-in-my-sql#:~:text=Calculating%20Distance%20in%20MySQL&text=The%20TL%3BDR%20of%20it,--%20Returns%20distance%20in%20meters.
    const infra: InfrastructureEntity = await this.infrastructureRepo
      .createQueryBuilder('infrastructure')
      .where(
        'ST_Distance_Sphere(point(ST_Latitude(coordinates), ST_Longitude(coordinates)), point(:latitude, :longitude)) < :distance',
        {
          latitude: positionRef.coordinates[0],
          longitude: positionRef.coordinates[1],
          distance: distance,
        },
      )
      .getOne();

    return infra;
  }
}

export default InfrastructureService;
