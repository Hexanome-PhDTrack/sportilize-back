import HttpException from './HttpException';

class CantWithdrawNotParticipatedEvent extends HttpException {
  constructor(uuid: string, eventId: number) {
    super(
      400,
      `User ${uuid} doesn't participate to event with id ${eventId}. Can't withdraw.`,
    );
  }
}

export default CantWithdrawNotParticipatedEvent;
