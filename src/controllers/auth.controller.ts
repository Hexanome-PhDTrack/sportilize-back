import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
// import { validate } from "class-validator";

import config from '../config/config';
import Controller from '../interfaces/controller.interface';
import * as express from 'express';
import { UserAuthEntity } from '../databaseEntities/UserAuthEntity';
import { AppDataSource } from '../data-source';

//cf
//https://github.com/andregardi/jwt-express-typeorm
class AuthController implements Controller {
  public path = '/auth';
  public router = express.Router();

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

  private register = async (req: Request, res: Response) => {
    //TODO
  };

  private login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }

    //Get user from database
    let user: UserAuthEntity;
    try {
      user = await AppDataSource.getRepository(UserAuthEntity).findOneOrFail({
        where: { username },
      });
    } catch (err) {
      res.status(401).send();
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '1h' },
    );

    //Send the jwt in the response
    res.send(token);
  };

  private logout = async (req: Request, res: Response) => {
    //TODO
  };

  private changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    let user: UserAuthEntity;
    try {
      user = await AppDataSource.getRepository(UserAuthEntity).findOneOrFail({
        where: { id },
      });
    } catch (err) {
      res.status(401).send();
    }

    // //Check if old password matchs
    // if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
    //   res.status(401).send();
    //   return;
    // }

    // //Validate the model (password length)
    // user.password = newPassword;
    // const errors = await validate(user);
    // if (errors.length > 0) {
    //   res.status(400).send(errors);
    //   return;
    // }
    // //Hash the new password and save
    // user.hashPassword();
    try {
      await AppDataSource.getRepository(UserAuthEntity).save(user);
    } catch (e) {
      res.status(401).send();
    }

    res.status(204).send();
  };
}
export default AuthController;
