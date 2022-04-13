import * as express from 'express';
import Controller from '../interfaces/controller.interface';

class UsersController implements Controller {
  public path = '/users';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    //User management
    this.router.put(`${this.path}/edit`, this.editUser);

    //Events interactions
    this.router.put(`${this.path}/join_event`, this.joinEvent);
    this.router.get(`${this.path}/user_events`, this.getUserEvents);
  }

  //User management
  public editUser = (req: express.Request, res: express.Response) => {
    res.send('AuthUser login');
  };

  //Events interactions//
  public joinEvent = (req: express.Request, res: express.Response) => {
    res.send('AuthUser login');
  };

  public getUserEvents = (req: express.Request, res: express.Response) => {
    res.send({
      message: 'AuthUser login',
    });
  };
}

export default UsersController;
