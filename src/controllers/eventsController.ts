import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import { AppDataSource } from '../data-source';
import { EventEntity } from '../databaseEntities/EventEntity';
import { UserAuthEntity } from '../databaseEntities/UserAuthEntity';
import { InfrastructureEntity } from '../databaseEntities/InfrastructureEntity';
import { checkJwt } from '../middlewares/checkJwt';
import AuthenticationService from '../services/auth.service';
import EventsService from '../services/event.service';
import SportService from '../services/sport.service';
import InfrastructureService from '../services/infrastructure.service';
import CreateEventInput from '../inputClasses/CreateEventInput';
import { validate } from 'class-validator';
import HttpException from '../exceptions/HttpException';
import { SportEntity } from '../databaseEntities/SportEntity';
import InfrastructureNotFoundException from '../exceptions/InfrastructureNotFoundException';
import SportNotFoundException from '../exceptions/SportNotFoundException';
import ParticipateToEventInput from '../inputClasses/ParticipateToEventInput';
import { UserEntity } from '../databaseEntities/UserEntity';
import UserService from '../services/user.service';
import UserNotFoundException from '../exceptions/UserNotFoundException';
import EventNotFoundException from '../exceptions/EventNotFoundException';

class EventsController implements Controller {
  public path = '/events';
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
    this.router.post(`${this.path}/create`, checkJwt, this.createEvent);
    this.router.put(`${this.path}/edit`, checkJwt, this.editEvent);
    this.router.put(`${this.path}/close`, this.closeEvent);
    this.router.delete(`${this.path}/cancel`, this.cancelEvent);
    this.router.get(`${this.path}/list_events`, this.listEvents);
    this.router.get(`${this.path}/export_event`, this.exportEvent);
    this.router.post(`${this.path}/participate`, this.createEvent);
    //
    this.router.put(`${this.path}/get_event`, this.getEvent);
  }

  //Events management//

  //We're using arrow functions to access props of an instance of the class.
  public async createEvent(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const reqParse: CreateEventInput = req.body;
    try {
      const errors = await validate(reqParse);
      if (errors.length > 0) {
        throw new HttpException(400, JSON.stringify(errors));
      }

      const creator: UserAuthEntity = await this.authenticationService.getUser(
        res.locals.jwtPayload.uuid,
      );
      const infra: InfrastructureEntity =
        await this.infrastructureService.getInfrastructure(
          reqParse.infrastructureId,
        );
      if (!infra) {
        throw new InfrastructureNotFoundException(reqParse.infrastructureId);
      }
      let sports: SportEntity[];
      reqParse.sports.forEach(async function (sport) {
        const sportEntity: SportEntity = await this.sportService.getSport(
          sport,
        );

        if (!sportEntity) {
          throw new SportNotFoundException(sport);
        } else {
          sports.push(sportEntity);
        }
      });
      const event: EventEntity = new EventEntity();
      event.infrastructure = infra;
      event.creator = creator;
      event.nbMaxParticipants = reqParse.nbMaxParticipants;
      event.sports = sports;
      event.description = reqParse.description;
      event.beginDate = new Date(Date.parse(reqParse.beginDate));
      event.endDate = new Date(Date.parse(reqParse.endDate));
      event.closed = false;

      this.eventsService.addEvent(event);
      res.status(200).send(event);
    } catch (e) {
      next(e);
    }
  }

  public async participateToEvent(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const reqParse: ParticipateToEventInput = req.body;
    try {
      const user: UserEntity = await this.userService.getUser(
        reqParse.userUuid,
      );
      if (!user) {
        throw new UserNotFoundException(reqParse.userUuid);
      }

      const event: EventEntity = await this.eventsService.getEvent(
        reqParse.eventId,
      );
      if (!event) {
        throw new EventNotFoundException(reqParse.eventId);
      }

      event.participants.push(user);
      this.eventsService.updateEvent(event);
      res.status(200).send(event);
    } catch (e) {
      next(e);
    }
  }

  public async editEvent(req: express.Request, res: express.Response) {
    res.send('Hello World!');
  }

  public closeEvent = (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };

  public cancelEvent = (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };

  public getEvent = async (req: express.Request, res: express.Response) => {
    //TODO fix this
    const id = parseInt(req.params.id);
    const event: EventEntity = await this.eventsService.getEvent(id);
    if (!event) {
      throw new EventNotFoundException(id);
    }
    res.status(200).send(event);
  };

  public listEvents = (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };

  public exportEvent = (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };
}

export default EventsController;
