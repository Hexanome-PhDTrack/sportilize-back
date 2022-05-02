import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import { AppDataSource } from '../data-source';
import { EventEntity } from '../databaseEntities/EventEntity';
import { UserAuthEntity } from '../databaseEntities/UserAuthEntity';
import SportsService from '../services/sports.service';

class SportsController implements Controller {
  public path = '/sports';
  public router = express.Router();
  public sportsService = new SportsService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    //Sports//
    this.router.get(`${this.path}/get_sport`, this.getSport);
    this.router.get(`${this.path}/get_all_sports`, this.getAllSports);
  }

  //Events management//

  //We're using arrow functions to access props of an instance of the class.
  public getSport = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const sportName = req.query.sportName;
    try {
      const sport = await this.sportsService.getSport(sportName);
      res.send(sport);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  public getAllSports = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const sportName = req.query.sportName;
    try {
      const sports = await this.sportsService.getAllSports();
      res.send(sports);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
}

export default SportsController;
