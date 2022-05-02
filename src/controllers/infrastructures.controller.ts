import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import AuthenticationService from '../services/auth.service';
import EventsService from '../services/event.service';
import SportService from '../services/sport.service';
import InfrastructureService from '../services/infrastructure.service';
import UserService from '../services/user.service';
import GetInfrastructureInput from '../inputClasses/GetInfrastructureInput';
import { validate } from 'class-validator';
import HttpException from '../exceptions/HttpException';
import { InfrastructureEntity } from '../databaseEntities/InfrastructureEntity';
import GetInfrastructuresbyAreaInput from '../inputClasses/GetInfrastructuresByAreaInput';
import { Point } from 'geojson';

class InfrastructuresController implements Controller {
  public path = '/infrastructures';
  public router = express.Router();
  public authenticationService = new AuthenticationService();
  public userService = new UserService();
  public infrastructureService = new InfrastructureService();
  public eventsService = new EventsService();
  public sportService = new SportService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    //Events Management//
    this.router.get(`${this.path}/get`, this.getInfrastructure);
    this.router.get(`${this.path}/getByArea`, this.getInfrastructureByArea);
  }

  public getInfrastructure = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const reqParse: GetInfrastructureInput = req.body;
    try {
      const errors = await validate(reqParse);
      if (errors.length > 0) {
        throw new HttpException(400, JSON.stringify(errors));
      }

      const infra: InfrastructureEntity =
        await this.infrastructureService.getInfrastructure(
          reqParse.infrastructureId,
        );
      res.status(200).send(infra);
    } catch (e) {
      next(e);
    }
  };

  public getInfrastructureByArea = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const reqParse: GetInfrastructuresbyAreaInput = req.body;
    try {
      const errors = await validate(reqParse);
      if (errors.length > 0) {
        throw new HttpException(400, JSON.stringify(errors));
      }
      const initPoint: Point = {
        type: 'Point',
        coordinates: [reqParse.lat, reqParse.long],
      };

      const infras: Array<InfrastructureEntity> =
        await this.infrastructureService.getInfrasByArea(
          initPoint,
          reqParse.distanceMax,
        );
      res.status(200).send(infras);
    } catch (e) {
      next(e);
    }
  };
}

export default InfrastructuresController;
