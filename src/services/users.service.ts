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
import LoginDto from '../databaseEntities/LoginDto';
import { validate } from 'class-validator';
import HttpException from '../exceptions/HttpException';
import { UserEntity } from '../databaseEntities/UserEntity';

class UsersService {
  public dbConnection: DataSource;
  public usersAuthRepo: Repository<UserAuthEntity>;
  public usersRepo: Repository<UserEntity>;

  constructor() {
    this.dbConnection = AppDataSource;
    this.usersAuthRepo = this.dbConnection.getRepository(UserAuthEntity);
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
    const user = await this.usersAuthRepo.findOne({
      where: { uuid: uuid },
    });
    if (!user) {
      throw new UserNotFoundException(uuid);
    }
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new HttpException(400, JSON.stringify(errors));
    }
    delete user.password;
    delete user.id;
    return user;
  }

  public async edit(userData: UserAuthEntity) {
    const existingUser = await this.usersAuthRepo.findOne({
      where: { email: userData.email },
    });
    if (!existingUser) {
      throw new UserNotFoundException(userData.email);
    }
    const errors = await validate(userData);
    if (errors.length > 0) {
      throw new HttpException(400, JSON.stringify(errors));
    }
    const editedUser = await this.usersAuthRepo.save(userData);
    delete editedUser.id;
    delete editedUser.password;
    return editedUser;
  }

  public async logout() {
    return 'Authorization=;Max-age=0';
  }

  public async changePassword(email, oldPassword: string, newPassword: string) {
    //Get usersAuthRepo from the database
    let user: UserAuthEntity;
    try {
      user = await this.usersAuthRepo.findOneOrFail({
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
      await this.usersAuthRepo.save(user);
    } catch (e) {
      console.log(e);
    }
  }
}

export default UsersService;
