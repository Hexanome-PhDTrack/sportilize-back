import HttpException from './HttpException';

class InfrastructureNotFoundException extends HttpException {
  constructor(id: number) {
    super(400, `Infrastructure with id ${id} not found.`);
  }
}

export default InfrastructureNotFoundException;
