import { UserEntity } from '../../src/databaseEntities/UserEntity';
import { TestUtils } from './TestUtils';

beforeEach(async () => {
  const testUtils = new TestUtils();
  await testUtils.connectToDb();
  const { dbConnection } = testUtils;
  await dbConnection.manager.clear(UserEntity);
});

describe('UserTable', async () => {
  const user = new UserEntity();
  const testUtils = new TestUtils();
  await testUtils.connectToDb();
  const { dbConnection } = testUtils;

  const insertUserTest = async () => {
    user.username = 'pldtest1';
    user.role = 'unauthenticated';
    console.log('test');
    await dbConnection.manager.save(user);
    console.log('Userhas been saved. user id is', user.id);
    expect(user.id).toBe(1);
  };

  const findUserTest = async () => {
    const user1 = await dbConnection
      .getRepository(UserEntity)
      .findOneOrFail({ where: { username: 'pldtest1' } });
    return user1;
  };

  await insertUserTest();
  const user1: UserEntity = await findUserTest();
  expect(user1.username).toBe('pldtest1');
});
