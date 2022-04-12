import express from 'express';
import bodyParser from 'body-parser';
import Controller from './interfaces/controller.interface';
import loggerMiddleware from './middlewares/logger.middleware';
import errorMiddleware from './middlewares/error.middleware';
import dotenv from 'dotenv';
dotenv.config();

// https://github.com/mwanago/express-typescript/blob/master/src/app.ts
class App {
  public app: express.Application;
  // private dbConnection:DataSource;

  constructor(controllers: Controller[]) {
    this.app = express();

    // this.connectToDb();
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

  //Not sure this is useful
  // private async connectToDb(){
  //   //TODO
  //   try {
  //     this.dbConnection = await AppDataSource.initialize()
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
}

export default App;
