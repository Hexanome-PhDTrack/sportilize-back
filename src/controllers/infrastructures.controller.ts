import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import InfrastructuresService from '../services/infrastructures.service';
import GetInfrastructuresbyAreaInput from '../inputClasses/GetInfrastructuresByAreaInput';
import { Point } from 'geojson';
import HttpException from '../exceptions/HttpException';
import GetInfrastructureInput from '../inputClasses/GetInfrastructureInput';
import { InfrastructureEntity } from '../databaseEntities/InfrastructureEntity';
import { validate } from 'class-validator';

class InfrastructuresController implements Controller {
  public path = '/infrastructures';
  public router = express.Router();
  public infrastructuresService = new InfrastructuresService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    //Sports//
    this.router.get(`${this.path}/get_infrastructure`, this.getInfra);
    this.router.get(`${this.path}/get_all_infrastructures`, this.getAllInfras);
    this.router.get(`${this.path}/get_by_area`, this.getInfrastructureByArea);
  }

  //Events management//

  //We're using arrow functions to access props of an instance of the class.
  public getInfra = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const infraID = req.query.infraID;
      const infra = await this.infrastructuresService.getInfra(infraID);
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
      const infras = await this.infrastructuresService.getAllInfras();
      res.send(infras);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  public getInfrastructureByArea = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const areaParams: any = req.query;
      const initPoint: Point = {
        type: 'Point',
        coordinates: [areaParams.lat, areaParams.long],
      };

      const infras: Array<InfrastructureEntity> =
        await this.infrastructuresService.getInfrasByArea(
          initPoint,
          areaParams.distanceMax,
        );
      res.status(200).send(infras);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
}

export default InfrastructuresController;
