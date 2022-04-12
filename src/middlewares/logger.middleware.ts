import { NextFunction, Request, Response } from 'express';

const loggerMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(`${request.method} ${request.path}`);
  next();
};

export default loggerMiddleware;
