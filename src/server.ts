import App from './app';
import UsersController from './controllers/usersController';
import EventsController from './controllers/eventsController';
import validateEnv from './utils/validateEnv';
import AuthController from './controllers/auth.controller';
import UsersAuthController from './controllers/usersAuth.controller';
import SportsController from './controllers/sports.controller';

validateEnv();

async function main() {
  const app = new App([
    new AuthController(),
    new UsersController(),
    new UsersAuthController(),
    new EventsController(),
    new SportsController(),
  ]);
  await app.connectToDb();
  app.listen();
}

main();
