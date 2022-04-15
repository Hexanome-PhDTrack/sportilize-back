import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import HttpException from '../exceptions/HttpException';
import TokenData from '../interfaces/tokenData.interface';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  console.log('jwt');
  const token = req.cookies.Authorization;
  console.log(token);
  let jwtPayload;

  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, process.env.JWT_SECRET);
    console.log(jwtPayload);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    throw new HttpException(403, 'Unauthorized');
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { uuid, username, userRole } = jwtPayload;
  const expiresIn = 60 * 60; // an hour
  const newToken = {
    expiresIn,
    token: jwt.sign({ uuid, username, userRole }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    }),
  };
  const cookie = createCookie(newToken);
  res.setHeader('Set-Cookie', [cookie]);
  next();
};

function createCookie(tokenData: TokenData) {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
}
