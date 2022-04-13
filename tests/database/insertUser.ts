import { UserEntity } from '../../src/databaseEntities/UserEntity';
import { TestUtils } from './TestUtils';

const test = async () => {
  const user = new UserEntity();
  const testUtils = new TestUtils();
  await testUtils.connectToDb();
  const { dbConnection } = testUtils;

  const insertUserTest = async () => {
    user.username = 'pldtest1';
    user.role = 'unauthenticated';
    await dbConnection.manager.save(user);
  };

  const findUserTest = async () => {
    const user1 = await dbConnection
      .getRepository(UserEntity)
      .findOneOrFail({ where: { username: 'pldtest1' } });
    return user1;
  };

  await insertUserTest();
  const user1: UserEntity = await findUserTest();
};

test();
