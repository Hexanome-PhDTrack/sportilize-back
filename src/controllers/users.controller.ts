import * as express from 'express';
import Controller from '../interfaces/controller.interface';

class usersController implements Controller {
  public path = '/users';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.signupUser);
    this.router.get(`${this.path}/login`, this.loginUser);
    this.router.put(`${this.path}/edit`, this.editUser);
  }

  signupUser = (req: express.Request, res: express.Response) => {
    console.log(req.params);
    res.send('AuthUser signup');
  };

  loginUser = (req: express.Request, res: express.Response) => {
    console.log(req.params);
    res.send('AuthUser login');
  };

  editUser = (req: express.Request, res: express.Response) => {
    console.log(req.params);
    res.send('AuthUser login');
  };
}

export default usersController;
