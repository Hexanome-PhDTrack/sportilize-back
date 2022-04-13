import App from './app';
import usersController from './controllers/users.controller';
import eventsController from './controllers/events.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

async function main() {
  const app = new App([new usersController(), new eventsController()]);
  await app.connectToDb();
  app.listen();
}

main();
