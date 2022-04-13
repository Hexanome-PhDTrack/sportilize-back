import App from './app';
import UsersController from './controllers/usersController';
import EventsController from './controllers/eventsController';
import validateEnv from './utils/validateEnv';
import AuthController from './controllers/auth.controller';

validateEnv();

async function main() {
  const app = new App([
    new AuthController(),
    new UsersController(),
    new EventsController(),
  ]);
  await app.connectToDb();
  app.listen();
}

main();
