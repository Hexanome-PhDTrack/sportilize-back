import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import { checkJwt } from '../middlewares/checkJwt';
import { NextFunction } from 'express';
import AuthenticationService from '../services/auth.service';
import UsersService from '../services/users.service';
import { UserAuthEntity } from '../databaseEntities/UserAuthEntity';
import { UserEntity } from '../databaseEntities/UserEntity';
import UsersAuthService from '../services/usersAuth.service';

class AuthUsersController implements Controller {
  public path = '/users_auth';
  public router = express.Router();
  public usersAuthService = new UsersAuthService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    //User management

    this.router.get(`${this.path}/info`, this.userInfo);
    this.router.put(`${this.path}/edit`, checkJwt, this.editUser);

    //Events interactions
    this.router.put(`${this.path}/join_event`, this.joinEvent);
    this.router.get(`${this.path}/user_events`, this.getUserEvents);
  }

  //User management
  public userInfo = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction,
  ) => {
    const email = req.query.email;
    try {
      const user = await this.usersAuthService.userInfo(email);
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
    const userData: UserAuthEntity = req.body;
    try {
      const editedUser = await this.usersAuthService.edit(userData);
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

export default AuthUsersController;
