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
import { SportEntity } from '../databaseEntities/SportEntity';

class SportsService {
  public dbConnection: DataSource;
  public sportsRepo: Repository<SportEntity>;

  constructor() {
    this.dbConnection = AppDataSource;
    this.sportsRepo = this.dbConnection.getRepository(SportEntity);
  }

  public getSport = async sportName => {
    //Get usersAuthRepo from database
    let sport: SportEntity;
    sport = await this.sportsRepo.findOneOrFail({
      where: { name: sportName },
    });

    if (!sport)
      throw new HttpException(404, `Couldn't find sport ${sportName}`);
    return sport;
  };

  public getAllSports = async () => {
    let sports: SportEntity[];
    sports = await this.sportsRepo.find();
    if (!sports) throw new HttpException(404, `Couldn't get sports`);
    return sports;
  };
}

export default SportsService;
