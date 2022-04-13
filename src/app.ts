import express from 'express';
import bodyParser from 'body-parser';
import Controller from './interfaces/controller.interface';
import loggerMiddleware from './middlewares/logger.middleware';
import errorMiddleware from './middlewares/error.middleware';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { DataSource } from 'typeorm';
dotenv.config();

// https://github.com/mwanago/express-typescript/blob/master/src/app.ts
class App {
  public app: express.Application;
  public dbConnection: DataSource;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.dbConnection = AppDataSource;
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling(); // this needs to be last in the app stack.
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(loggerMiddleware);
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers) {
    controllers.forEach(controller => {
      this.app.use('/api/v1', controller.router);
    });
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  public async connectToDb() {
    try {
      await AppDataSource.initialize();
    } catch (e) {
      console.log(e);
    }
  }
}

export default App;
