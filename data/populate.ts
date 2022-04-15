import * as fs from 'fs';
import { AuthenticationService } from '../src/services/auth.service';
import { DataSource } from 'typeorm';
import { UserEntity } from '../src/databaseEntities/UserEntity';
import { v4 as uuidv4 } from 'uuid';

//run: ts-node ./data/populate.ts
const authenticationService: AuthenticationService =
  new AuthenticationService();
const userRepository = authenticationService.userAuthRepo;

import { AppDataSource } from '../src/data-source';
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
async function populate() {
  await AppDataSource.initialize();
  const userRepository = AppDataSource.getRepository(UserEntity);
  for (let i = 0; i < data.usernames.length; i++) {
    const user: UserEntity = new UserEntity();
    user.id = i;
    user.guid = uuidv4();
    user.username = data.usernames[i];
    user.role = '';

    // save users to the database
    await userRepository.save(user);
    users.push(user);
  }
}
populate();

// make a request to the database to see if the data is there
userRepository.find().then(users => {
  console.log(users);
});
