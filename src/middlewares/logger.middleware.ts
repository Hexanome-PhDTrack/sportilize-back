import { NextFunction, Request, Response } from 'express';

const loggerMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(`${request.method} ${request.path}`);
  console.log(request.body);
  next();
};

export default loggerMiddleware;
