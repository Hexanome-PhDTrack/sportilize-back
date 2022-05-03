import { DataSource, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import HttpException from '../exceptions/HttpException';
import { SportEntity } from '../databaseEntities/SportEntity';

class SportsService {
  public dbConnection: DataSource;
  public sportsRepo: Repository<SportEntity>;

  constructor() {
    this.dbConnection = AppDataSource;
    this.sportsRepo = this.dbConnection.getRepository(SportEntity);
  }

  public getSport = async sportName => {
    //Get usersAuthRepo from database
    let sport: SportEntity;
    sport = await this.sportsRepo.findOneOrFail({
      where: { name: sportName },
    });

    if (!sport)
      throw new HttpException(404, `Couldn't find sport ${sportName}`);
    return sport;
  };

  public getAllSports = async () => {
    let sports: SportEntity[];
    sports = await this.sportsRepo.find();
    if (!sports) throw new HttpException(404, `Couldn't get sports`);
    return sports;
  };
}

export default SportsService;
