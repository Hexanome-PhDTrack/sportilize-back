import { NextFunction, Request, Response } from 'express';
import Controller from '../interfaces/controller.interface';
import * as express from 'express';
import { UserAuthEntity } from '../databaseEntities/UserAuthEntity';
import AuthenticationService from '../services/auth.service';
import loginDto from '../databaseEntities/LoginDto';

//cf
//https://github.com/andregardi/jwt-express-typeorm
class AuthController implements Controller {
  public path = '/auth';
  public router = express.Router();
  public authenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    //Users auth
    this.router.post(`${this.path}/register`, this.register);
    this.router.post(`${this.path}/login`, this.login);
    this.router.post(`${this.path}/logout`, this.logout);
    this.router.post(`${this.path}/change_password`, this.changePassword);
  }

  public register = async (req: Request, res: Response, next: NextFunction) => {
    const userData: UserAuthEntity = req.body;
    try {
      const { cookie, user } = await this.authenticationService.register(
        userData,
      );
      res.setHeader('Set-Cookie', [cookie]);
      res.send(user);
    } catch (e) {
      next(e);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    const loginData: loginDto = req.body;
    if (!loginData) {
      res.status(400).send();
    }

    try {
      const { cookie, user } = await this.authenticationService.login(
        loginData,
      );
      res.setHeader('Set-Cookie', [cookie]);
      res.send(user);
    } catch (e) {
      next(e);
    }
  };

  public logout = async (req: Request, res: Response) => {
    const cookie = await this.authenticationService.logout();
    res.setHeader('Set-Cookie', [cookie]);
    res.send(200);
  };

  public changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    //Get parameters from the body
    const { oldPassword, newPassword, email } = req.body;
    if (!(oldPassword && newPassword && email)) {
      res.status(400).send();
    }

    try {
      await this.authenticationService.changePassword(
        email,
        oldPassword,
        newPassword,
      );
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}

export default AuthController;
