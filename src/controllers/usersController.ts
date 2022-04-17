import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import { checkJwt } from '../middlewares/checkJwt';
import { NextFunction } from 'express';
import AuthenticationService from '../services/auth.service';
import UsersService from '../services/users.service';
import { UserAuthEntity } from '../databaseEntities/UserAuthEntity';
import { UserEntity } from '../databaseEntities/UserEntity';

class UsersController implements Controller {
  public path = '/users';
  public router = express.Router();
  public usersService = new UsersService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    //User management

    //Unauth user
    this.router.post(`${this.path}/new_user`, this.newUserNotAuth);
    this.router.get(`${this.path}/info`, this.userInfo);

    //Events interactions
    this.router.put(`${this.path}/join_event`, this.joinEvent);
    this.router.get(`${this.path}/user_events`, this.getUserEvents);
  }

  //User management

  public newUserNotAuth = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction,
  ) => {
    const userData: UserEntity = req.body;
    try {
      const user = await this.usersService.newUserNotAuth(userData);
      res.status(201).send(user);
    } catch (e) {
      next(e);
    }
  };

  public userInfo = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction,
  ) => {
    const uuid = req.query.uuid;
    try {
      const user = await this.usersService.userInfo(uuid.toString());
      res.send(user);
    } catch (e) {
      next(e);
    }
  };

  public editUser = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction,
  ) => {
    const userData: UserEntity = req.body;
    try {
      const editedUser = await this.usersService.edit(userData);
      res.status(204).send(editedUser);
    } catch (e) {
      next(e);
    }
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
