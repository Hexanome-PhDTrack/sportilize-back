import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import { AppDataSource } from '../data-source';
import { EventEntity } from '../databaseEntities/EventEntity';
import { UserAuthEntity } from '../databaseEntities/UserAuthEntity';
import SportsService from '../services/sports.service';
import InfrastructureService from '../services/infrastructures.service';

class InfrastructureController implements Controller {
  public path = '/infrastructures';
  public router = express.Router();
  public infrastructureService = new InfrastructureService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    //Sports//
    this.router.get(`${this.path}/get_infrastructure`, this.getInfra);
    this.router.get(`${this.path}/get_all_infrastructures`, this.getAllInfras);
  }

  //Events management//

  //We're using arrow functions to access props of an instance of the class.
  public getInfra = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const infraID = req.query.infraID;
    try {
      const infra = await this.infrastructureService.getInfra(infraID);
      res.send(infra);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  public getAllInfras = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const infras = await this.infrastructureService.getAllInfras();
      res.send(infras);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
}

export default InfrastructureController;
