import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import { EventEntity } from '../databaseEntities/EventEntity';
import { UserAuthEntity } from '../databaseEntities/UserAuthEntity';
import { InfrastructureEntity } from '../databaseEntities/InfrastructureEntity';
import { checkJwt } from '../middlewares/checkJwt';
import AuthenticationService from '../services/auth.service';
import EventsService from '../services/event.service';
import SportService from '../services/sports.service';
import InfrastructureService from '../services/infrastructures.service';
import CreateEventInput from '../inputClasses/CreateEventInput';
import { validate } from 'class-validator';
import HttpException from '../exceptions/HttpException';
import { SportEntity } from '../databaseEntities/SportEntity';
import InfrastructureNotFoundException from '../exceptions/InfrastructureNotFoundException';
import SportNotFoundException from '../exceptions/SportNotFoundException';
import ParticipateAndWithdrawToEventInput from '../inputClasses/ParticipateAndWithdrawToEventInput';
import { UserEntity } from '../databaseEntities/UserEntity';
import UserService from '../services/user.service';
import UserNotFoundException from '../exceptions/UserNotFoundException';
import EventNotFoundException from '../exceptions/EventNotFoundException';
import GetEventsByInfraInput from '../inputClasses/GetEventsByInfraInput';
import CantWithdrawNotParticipatedEvent from '../exceptions/CantWithdrawNotParticipatedEvent';
// @ts-ignore
import CloseEventInput from '../inputClasses/CloseEventInput';

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
    this.router.put(`${this.path}/close`, checkJwt, this.closeEvent);
    this.router.delete(`${this.path}/cancel`, this.cancelEvent);
    this.router.get(
      `${this.path}/list_events_closed_by_infrastructure`,
      this.listEventsClosedByInfrastructure,
    );
    this.router.get(
      `${this.path}/list_events_not_closed_by_infrastructure`,
      this.listEventsNotClosedByInfrastructure,
    );
    this.router.get(
      `${this.path}/get_organized_by_user`,
      checkJwt,
      this.getEventsOrganizedByUser,
    );
    this.router.get(
      `${this.path}/get_events_to_participate`,
      this.getEventsToParticipate,
    );
    this.router.get(`${this.path}/export_event`, this.exportEvent);
    this.router.post(`${this.path}/participate`, this.participateToEvent);
    this.router.post(`${this.path}/withdraw`, this.withdraw);
    //
    this.router.put(`${this.path}/get_event`, this.getEvent);
  }

  //Events management//

  //We're using arrow functions to access props of an instance of the class.
  public createEvent = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const reqParse: CreateEventInput = req.body;
      const errors = await validate(reqParse);
      if (errors.length > 0) {
        throw new HttpException(400, JSON.stringify(errors));
      }
      const creator: UserAuthEntity = await this.authenticationService.getUser(
        res.locals.jwtPayload.uuid,
      );
      const infra: InfrastructureEntity =
        await this.infrastructureService.getInfra(reqParse.infrastructureId);
      if (!infra) {
        throw new InfrastructureNotFoundException(reqParse.infrastructureId);
      }
      let sports: SportEntity[] = [];
      for (const sport of reqParse.sports) {
        const sportEntity: SportEntity = await this.sportService.getSport(
          sport,
        );
        if (!sportEntity) {
          throw new SportNotFoundException(sport);
        } else {
          sports.push(sportEntity);
        }
      }
      const event: EventEntity = new EventEntity();
      event.infrastructure = infra;
      event.name = reqParse.name;
      event.creator = creator;
      event.nbMaxParticipants = reqParse.nbMaxParticipants;
      event.sports = sports;
      event.description = reqParse.description;
      event.beginDate = new Date(Date.parse(reqParse.beginDate));
      event.endDate = new Date(Date.parse(reqParse.endDate));
      event.closed = false;
      event.review = '';

      await this.eventsService.addEvent(event);
      res.status(200).send(event);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  public participateToEvent = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const reqParse: ParticipateAndWithdrawToEventInput = req.body;
      //console.log("participate : " + JSON.stringify(reqParse));
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
  };

  public withdraw = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const reqParse: ParticipateAndWithdrawToEventInput = req.body;
      //console.log("participate : " + JSON.stringify(reqParse));
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

      const newParticipants: Array<UserEntity> = event.participants.filter(
        (value: UserEntity) => {
          value.uuid != user.uuid;
        },
      );

      if (event.participants.length == newParticipants.length) {
        throw new CantWithdrawNotParticipatedEvent(user.uuid, event.id);
      }

      event.participants = newParticipants;

      this.eventsService.updateEvent(event);
      res.status(200).send(event);
    } catch (e) {
      next(e);
    }
  };

  public editEvent = async (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };

  public closeEvent = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const reqParse: CloseEventInput = req.body;
      const { eventId, endDate, review } = reqParse;
      const userId = res.locals.jwtPayload.uuid;
      await this.eventsService.closeEvent(eventId, userId, endDate, review);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  public cancelEvent = async (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };

  public getEvent = async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id);
    const event: EventEntity = await this.eventsService.getEvent(id);
    if (!event) {
      throw new EventNotFoundException(id);
    }
    res.status(200).send(event);
  };

  public listEventsClosedByInfrastructure = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const id: number = parseInt(req.query.id as string);

      const infra: InfrastructureEntity =
        await this.infrastructureService.getInfra(id);
      const events: Array<EventEntity> =
        await this.eventsService.getEventsByInfra(infra, true);
      res.status(200).send(events);
    } catch (e) {
      next(e);
    }
  };

  public listEventsNotClosedByInfrastructure = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const id: number = parseInt(req.query.id as string);

      const infra: InfrastructureEntity =
        await this.infrastructureService.getInfra(id);
      const events: Array<EventEntity> =
        await this.eventsService.getEventsByInfra(infra, false);
      res.status(200).send(events);
    } catch (e) {
      next(e);
    }
  };

  public getEventsOrganizedByUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const creator: UserAuthEntity = await this.authenticationService.getUser(
        res.locals.jwtPayload.uuid,
      );

      const events: Array<EventEntity> =
        await this.eventsService.getEventsOrganizedByUser(creator);

      res.status(200).send(events);
    } catch (e) {
      next(e);
    }
  };

  public getEventsToParticipate = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const uuid: string = req.query.uuid as string;
      const user: UserEntity = await this.userService.getUser(uuid);
      if (!user) {
        throw new UserNotFoundException(user.uuid);
      }

      const events: Array<EventEntity> =
        await this.eventsService.getEventsToParticipateUser(user);

      res.status(200).send(events);
    } catch (e) {
      next(e);
    }
  };

  public exportEvent = async (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
  };
}

export default EventsController;
