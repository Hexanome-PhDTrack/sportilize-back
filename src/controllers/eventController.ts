import { Request, Response } from 'express';
export class eventController {
  static create(req: Request, res: Response) {
    res.send('Hello World!');
  }

  static edit(req: Request, res: Response) {
    res.send('Hello World!');
  }

  static close(req: Request, res: Response) {
    res.send('Hello World!');
  }

  static listEvents(req: Request, res: Response) {
    res.send('Hello World!');
  }
}
