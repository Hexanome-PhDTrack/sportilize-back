import App from './app';
import usersController from './controllers/users.controller';
import eventsController from './controllers/events.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new usersController(), new eventsController()]);

app.listen();
