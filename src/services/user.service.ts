import { UserEntity } from '../databaseEntities/UserEntity';
import { DataSource, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { UserAuthEntity } from '../databaseEntities/UserAuthEntity';

class UserService {
  public dbConnection: DataSource;
  public userRepo: Repository<UserEntity>;
  public userAuthRepo: Repository<UserEntity>;

  constructor() {
    this.dbConnection = AppDataSource;
    this.userRepo = this.dbConnection.getRepository(UserEntity);
    this.userAuthRepo = this.dbConnection.getRepository(UserAuthEntity);
  }

  public async getUser(uuid: string): Promise<UserEntity> {
    let user: any = await this.userRepo.findOne({
      where: { uuid: uuid },
    });

    if (!user) {
      user = await this.userAuthRepo.findOne({
        where: { uuid: uuid },
      });
    }

    return user;
  }
}

export default UserService;
