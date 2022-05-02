import { InfrastructureEntity } from '../databaseEntities/InfrastructureEntity';
import { DataSource, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Point } from 'geojson';

function calculDist(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // metres
  const sigma1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const sigma2 = (lat2 * Math.PI) / 180;
  const deltaSigma = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaSigma / 2) * Math.sin(deltaSigma / 2) +
    Math.cos(sigma1) *
      Math.cos(sigma2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in meter
  return d;
}

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
  public async getInfrasByArea(
    positionRef: Point,
    distance: number,
  ): Promise<Array<InfrastructureEntity>> {
    // https://www.movable-type.co.uk/scripts/latlong.html
    const allInfra: Array<InfrastructureEntity> =
      await this.infrastructureRepo.find();
    let resultInfra: Array<InfrastructureEntity> = new Array();
    for (let i: number; i < allInfra.length; i++) {
      const infra: InfrastructureEntity = allInfra[i];
      const pointInfra: Point = JSON.parse(infra.point);
      if (
        Math.abs(
          calculDist(
            positionRef.coordinates[0],
            positionRef.coordinates[1],
            pointInfra.coordinates[0],
            pointInfra.coordinates[1],
          ),
        ) <= distance
      ) {
        resultInfra.push(infra);
      }
    }

    return resultInfra;
  }
}

export default InfrastructureService;
