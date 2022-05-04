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

class UsersAuthService {
  public dbConnection: DataSource;
  public usersAuthRepo: Repository<UserAuthEntity>;
  public usersRepo: Repository<UserEntity>;

  constructor() {
    this.dbConnection = AppDataSource;
    this.usersAuthRepo = this.dbConnection.getRepository(UserAuthEntity);
  }

  public async userInfo(email: string) {
    const user = await this.usersAuthRepo.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new UserNotFoundException(email);
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
    await this.usersAuthRepo.save({
      ...existingUser,
      ...userData,
    });
  }

  public async deleteUser(uuid, email, password) {
    const existingUser = await this.usersAuthRepo.findOne({
      where: { email: email },
    });
    if (!existingUser) {
      throw new UserNotFoundException(email);
    }
    if (!existingUser.uuid === uuid)
      throw new HttpException(403, 'UUID not corresponding to email');
    if (!existingUser.password === password)
      throw new HttpException(403, 'Wrong password');
    await this.usersAuthRepo.delete({ email: email });
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

export default UsersAuthService;
