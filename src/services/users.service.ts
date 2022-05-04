import * as jwt from 'jsonwebtoken';
import { UserAuthEntity } from '../databaseEntities/UserAuthEntity';
import { DataSource, Repository } from 'typeorm';
import TokenData from '../interfaces/tokenData.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import { AppDataSource } from '../data-source';
import express, { NextFunction } from 'express';
import UserNotFoundException from '../exceptions/UserNotFoundException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import UserExistsException from '../exceptions/UserExistsException';
import LoginDto from '../dataTransfertObject/LoginDto';
import { validate } from 'class-validator';
import HttpException from '../exceptions/HttpException';
import { UserEntity } from '../databaseEntities/UserEntity';

class UsersService {
  public dbConnection: DataSource;
  public usersRepo: Repository<UserEntity>;

  constructor() {
    this.dbConnection = AppDataSource;
    this.usersRepo = this.dbConnection.getRepository(UserEntity);
  }

  public newUserNotAuth = async (userData: UserEntity) => {
    const userInDb = await this.usersRepo.findOne({
      where: { uuid: userData.uuid },
    });
    if (userInDb) {
      throw new UserExistsException(userData.uuid);
    }
    userData.role = '';
    const errors = await validate(userData);
    if (errors.length > 0) {
      throw new HttpException(400, JSON.stringify(errors));
    }
    await this.usersRepo.save(userData);
    delete userData.id;
    return userData;
  };

  public async userInfo(uuid: string) {
    const user = await this.usersRepo.findOne({
      where: { uuid: uuid },
    });
    if (!user) {
      throw new UserNotFoundException(uuid);
    }
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new HttpException(400, JSON.stringify(errors));
    }
    delete user.id;
    return user;
  }

  public async getUser(uuid: string): Promise<UserEntity> {
    const user: UserEntity = await this.usersRepo.findOne({
      where: { uuid: uuid },
    });

    return user;
  }

  public async edit(userData: UserEntity) {
    const existingUser = await this.usersRepo.findOne({
      where: { uuid: userData.uuid },
    });
    if (!existingUser) {
      throw new UserNotFoundException(userData.uuid);
    }
    userData.role = '';
    const errors = await validate(userData);
    if (errors.length > 0) {
      throw new HttpException(400, JSON.stringify(errors));
    }
    const editedUser = await this.usersRepo.save(userData);
    delete editedUser.id;
    return editedUser;
  }

  public async logout() {
    return 'Authorization=;Max-age=0';
  }
}

export default UsersService;
