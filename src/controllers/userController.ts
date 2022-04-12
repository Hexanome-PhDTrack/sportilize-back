import { AuthUser } from '../models/AuthUser';
import { User } from '../models/User';
import { Request, Response } from 'express';

export class userController {
  static signup(req: Request, res: Response) {
    console.log(req.params);
    res.send('AuthUser signup');
  }

  static login(req: Request, res: Response) {
    console.log(req.params);
    res.send('AuthUser login');
  }

  static edit(req: Request, res: Response) {
    console.log(req.params);
    res.send('AuthUser login');
  }

  //Events//
  static joinEvent(req: Request, res: Response) {
    console.log(req.params);
    res.send('AuthUser login');
  }
}
