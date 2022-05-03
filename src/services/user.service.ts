import { UserEntity } from '../databaseEntities/UserEntity';
import { DataSource, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';

class UserService {
  public dbConnection: DataSource;
  public userRepo: Repository<UserEntity>;

  constructor() {
    this.dbConnection = AppDataSource;
    this.userRepo = this.dbConnection.getRepository(UserEntity);
  }

  public async getUser(uuid: string): Promise<UserEntity> {
    const user: UserEntity = await this.userRepo.findOne({
      where: { uuid: uuid },
    });

    return user;
  }
}

export default UserService;
