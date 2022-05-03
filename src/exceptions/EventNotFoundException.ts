import HttpException from './HttpException';

class EventNotFoundException extends HttpException {
  constructor(id: number) {
    super(404, `event with id ${id} not found`);
  }
}

export default EventNotFoundException;
