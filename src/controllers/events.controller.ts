import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import { AppDataSource } from '../data-source';
import { EventEntity } from '../databaseEntities/EventEntity';
import { UserAuthEntity } from '../databaseEntities/UserAuthEntity';

class eventsController implements Controller {
  public path = '/events';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    //Events Management//
    this.router.post(`${this.path}/create`, this.createEvent);
    this.router.put(`${this.path}/edit`, this.editEvent);
    this.router.put(`${this.path}/close`, this.closeEvent);
    this.router.delete(`${this.path}/cancel`, this.cancelEvent);
    this.router.get(`${this.path}/list_events`, this.listEvents);
    this.router.get(`${this.path}/export_event`, this.exportEvent);

    //Users actions
    this.router.put(`${this.path}/get_event`, this.getEvent);
    this.router.put(`${this.path}/join_event`, this.joinEvent);
    this.router.get(`${this.path}/user_events`, this.getUserEvents);
  }

  //Events management//

  //We're using arrow functions to access props of an instance of the class.
  private createEvent = (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };

  private editEvent = (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };

  private closeEvent = (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };

  private cancelEvent = (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };

  private getEvent = async (req: express.Request, res: express.Response) => {
    //TODO fix this
    const id = parseInt(req.params.id);
    const event = await AppDataSource.getRepository(EventEntity).findOneOrFail({
      where: { id },
    });
  };

  private listEvents = (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };

  private exportEvent = (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };

  //User interactions//

  private joinEvent = (req: express.Request, res: express.Response) => {
    console.log(req.params);
    res.send('AuthUser login');
  };

  private getUserEvents = (req: express.Request, res: express.Response) => {
    console.log(req.params);
    res.send('AuthUser login');
  };
}

export default eventsController;
