import * as fs from 'fs';
import { AuthenticationService } from '../src/services/auth.service';
import { AppDataSource } from '../src/data-source';
import { DataSource } from 'typeorm';
import { UserEntity } from '../src/databaseEntities/UserEntity';
import { v4 as uuidv4 } from 'uuid';

async function populateUserEntity() {
  //run: ts-node ./data/populate.ts
  await AppDataSource.initialize();
  const userRepository = AppDataSource.getRepository(UserEntity);

  // load users data and generate mockup users
  // then push them to the database

  // load users.json file
  const data = JSON.parse(
    fs.readFileSync(`${__dirname}/mockup/users.json`, 'utf8'),
  );

  data.usernames.forEach(async user => {
    console.log(user);
  });

  let users: UserEntity[] = [];
  for (let i = 0; i < data.usernames.length; i++) {
    const user: UserEntity = new UserEntity();
    user.id = i;
    user.uuid = uuidv4();
    user.username = data.usernames[i];
    user.role = '';

    // save users to the database
    await userRepository.save(user);
    users.push(user);
  }

  // make a request to the database to see if the data is there
  userRepository.find().then(users => {
    console.log(users);
  });
}
populateUserEntity();

// terminate process
process.exit(0);
