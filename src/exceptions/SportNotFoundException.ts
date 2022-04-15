import HttpException from './HttpException';

class SportNotFoundException extends HttpException {
  constructor(name: string) {
    super(400, `Sport with name ${name} not found.`);
  }
}

export default SportNotFoundException;
