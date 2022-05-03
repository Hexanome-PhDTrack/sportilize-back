import * as fs from 'fs';
import { AppDataSource } from '../src/data-source';
import {
  UserEntity,
  DEFAULT_USER_ROLE,
} from '../src/databaseEntities/UserEntity';
import { v4 as uuidv4 } from 'uuid';

async function populateUserEntity() {
  //run: ts-node ./data/populate.ts
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.log(error);
  }

  const userRepository = AppDataSource.getRepository(UserEntity);

  // load mockup user data
  console.log('Loading users data...');
  const data = JSON.parse(
    fs.readFileSync(`${__dirname}/mockup/users.json`, 'utf8'),
  );

  data.usernames.forEach(async user => {
    console.log(user);
  });

  let users: UserEntity[] = [];
  const populate = async () => {
    for (let i = 0; i < data.usernames.length; i++) {
      const user: UserEntity = new UserEntity();
      user.id = i;
      user.uuid = uuidv4();
      user.username = data.usernames[i];
      user.role = DEFAULT_USER_ROLE;

      // save users to the database
      await userRepository.save(user);
      users.push(user);
    }
  };
  await populate();

  // make a request to the database to see if the data is there
  userRepository.find().then(users => {
    console.log(users);
  });

  // terminate process
  process.exit(0); // WARN: last main instruction
}

populateUserEntity();
