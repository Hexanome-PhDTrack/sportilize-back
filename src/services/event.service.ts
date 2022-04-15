import { EventEntity } from '../databaseEntities/EventEntity';
import { DataSource, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { validate } from 'class-validator';
import HttpException from '../exceptions/HttpException';

class EventsService {
  public dbConnection: DataSource;
  public eventRepo: Repository<EventEntity>;

  constructor() {
    this.dbConnection = AppDataSource;
    this.eventRepo = this.dbConnection.getRepository(EventEntity);
  }

  public async addEvent(eventData: EventEntity): Promise<EventEntity> {
    const errors = await validate(eventData);
    if (errors.length > 0) {
      throw new HttpException(400, JSON.stringify(errors));
    }
    const event = await this.eventRepo.save(eventData);
    return event;
  }

  public async getEvent(id: number): Promise<EventEntity> {
    const event: EventEntity = await this.eventRepo.findOne({
      where: { id: id },
    });

    return event;
  }

  public async updateEvent(eventData: EventEntity) {
    const event = await this.eventRepo.save(eventData);
    return event;
  }
}

export default EventsService;
