import { DataSource, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import HttpException from '../exceptions/HttpException';
import { InfrastructureEntity } from '../databaseEntities/InfrastructureEntity';
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
  public infrasRepo: Repository<InfrastructureEntity>;

  constructor() {
    this.dbConnection = AppDataSource;
    this.infrasRepo = this.dbConnection.getRepository(InfrastructureEntity);
  }

  public getInfra = async infraID => {
    //Get usersAuthRepo from database
    let infra: InfrastructureEntity;
    infra = await this.infrasRepo.findOneOrFail({
      where: { id: infraID },
    });

    if (!infra)
      throw new HttpException(404, `Couldn't find infrastructure ${infraID}`);
    return infra;
  };

  public getAllInfras = async () => {
    let infras: InfrastructureEntity[];
    infras = await this.infrasRepo.find();
    if (!infras) throw new HttpException(404, `Couldn't get infrastructures`);
    return infras;
  };

  /**
   *
   * @param positionRef
   * @param distance in meter
   * @param closed
   * @returns
   */
  public getInfrasByArea = async (
    positionRef: Point,
    distance: number,
  ): Promise<Array<InfrastructureEntity>> => {
    // https://www.movable-type.co.uk/scripts/latlong.html
    const allInfra: Array<InfrastructureEntity> = await this.infrasRepo.find();
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
  };
}

export default InfrastructureService;
