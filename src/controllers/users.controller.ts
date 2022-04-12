import * as express from 'express';
import Controller from '../interfaces/controller.interface';

class usersController implements Controller {
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
  editUser = (req: express.Request, res: express.Response) => {
    console.log(req.params);
    res.send('AuthUser login');
  };

  //Events interactions//
  private joinEvent = (req: express.Request, res: express.Response) => {
    console.log(req.params);
    res.send('AuthUser login');
  };

  private getUserEvents = (req: express.Request, res: express.Response) => {
    console.log(req.params);
    res.send('AuthUser login');
  };
}

export default usersController;
