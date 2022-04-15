import HttpException from './HttpException';

class WrongCredentialsException extends HttpException {
  constructor() {
    super(401, 'Invalid credentials');
  }
}

export default WrongCredentialsException;
