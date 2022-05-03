import * as fs from 'fs';
import { AppDataSource } from '../src/data-source';
import { UserAuthEntity } from '../src/databaseEntities/UserAuthEntity';
import { DEFAULT_USER_ROLE } from '../src/databaseEntities/UserEntity';
import { v4 as uuidv4 } from 'uuid';

async function populateUserAuthEntity() {
  //run: ts-node-script ./data/populate_user_auth.ts
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.log(error);
  }

  const userRepository = AppDataSource.getRepository(UserAuthEntity);

  // load mockup user data
  console.log('Loading users data...');
  const data = JSON.parse(
    fs.readFileSync(`${__dirname}/mockup/users_auth.json`, 'utf8'),
  );

  // log loaded values
  console.log(`data size: ${data.length}`);
  console.log(data);
  data.users.forEach(async user => {
    console.log(user);
  });

  let users: UserAuthEntity[] = [];
  // async arrow function that has access to current scope
  const populate = async () => {
    for (let i = 0; i < data.users.length; i++) {
      const user: UserAuthEntity = new UserAuthEntity();
      user.id = i;
      user.uuid = uuidv4();
      user.username = data.users[i].username;
      user.role = DEFAULT_USER_ROLE;
      user.email = data.users[i].email;
      user.password = data.users[i].password;

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

populateUserAuthEntity();
