import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import { AppDataSource } from '../data-source';
import { EventEntity } from '../databaseEntities/EventEntity';
import { UserAuthEntity } from '../databaseEntities/UserAuthEntity';

class EventsController implements Controller {
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

    //
    this.router.put(`${this.path}/get_event`, this.getEvent);
  }

  //Events management//

  //We're using arrow functions to access props of an instance of the class.
  public createEvent = (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };

  public editEvent = (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };

  public closeEvent = (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };

  public cancelEvent = (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };

  public getEvent = async (req: express.Request, res: express.Response) => {
    //TODO fix this
    const id = parseInt(req.params.id);
    const event = await AppDataSource.getRepository(EventEntity).findOneOrFail({
      where: { id },
    });
  };

  public listEvents = (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };

  public exportEvent = (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };
}

export default EventsController;
