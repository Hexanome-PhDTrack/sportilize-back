import * as jwt from 'jsonwebtoken';
import { UserAuthEntity } from '../databaseEntities/UserAuthEntity';
import { DataSource, Repository } from 'typeorm';
import TokenData from '../interfaces/tokenData.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import { AppDataSource } from '../data-source';
import express from 'express';
import UserNotFoundException from '../exceptions/UserNotFoundException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import UserExistsException from '../exceptions/UserExistsException';
import LoginDto from '../databaseEntities/LoginDto';
import { validate } from 'class-validator';
import HttpException from '../exceptions/HttpException';

class AuthenticationService {
  public dbConnection: DataSource;
  public userAuthRepo: Repository<UserAuthEntity>;

  constructor() {
    this.dbConnection = AppDataSource;
    this.userAuthRepo = this.dbConnection.getRepository(UserAuthEntity);
  }

  public async register(userData: UserAuthEntity) {
    //Can't register 2 users with the same email
    if (
      await this.userAuthRepo.findOne({
        where: { email: userData.email },
      })
    ) {
      throw new UserExistsException(userData.email);
    }
    const errors = await validate(userData);
    if (errors.length > 0) {
      throw new HttpException(400, JSON.stringify(errors));
    }
    const user = await this.userAuthRepo.save(userData);
    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);
    return {
      cookie,
      user,
    };
  }

  public async login(loginData: LoginDto) {
    //Get userAuthRepo from database
    let user: UserAuthEntity;
    try {
      user = await this.userAuthRepo.findOneOrFail({
        where: { email: loginData.email },
      });
    } catch (e) {
      console.log(e);
    }

    if (!user) throw new UserNotFoundException(loginData.email);

    const isMatchingPassword = loginData.password === user.password;
    if (!isMatchingPassword) throw new WrongCredentialsException();

    //Sing JWT, valid for 1 hour
    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);
    return {
      cookie,
      user,
    };
  }

  public async logout() {
    return 'Authorization=;Max-age=0';
  }

  public async changePassword(email, oldPassword: string, newPassword: string) {
    //Get userAuthRepo from the database
    let user: UserAuthEntity;
    try {
      user = await this.userAuthRepo.findOneOrFail({
        where: { email: email },
      });
    } catch (err) {
      console.log(err);
    }

    if (!(user.password === oldPassword)) throw new WrongCredentialsException();

    //Validate the model (password length)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new HttpException(400, JSON.stringify(errors));
    }

    //save
    try {
      await this.userAuthRepo.save(user);
    } catch (e) {
      console.log(e);
    }
  }

  public createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  public createToken(user: UserAuthEntity): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user.id.toString(),
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }
}

export default AuthenticationService;
