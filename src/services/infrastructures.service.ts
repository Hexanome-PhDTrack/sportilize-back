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
import { InfrastructureEntity } from '../databaseEntities/InfrastructureEntity';

class InfrastructureService {
  public dbConnection: DataSource;
  public infrasRepo: Repository<InfrastructureEntity>;

  constructor() {
    this.dbConnection = AppDataSource;
    this.infrasRepo = this.dbConnection.getRepository(InfrastructureEntity);
  }

  public getInfra = async infraID => {
    //Get usersAuthRepo from database
    let infra: InfrastructureEntity;
    infra = await this.infrasRepo.findOneOrFail({
      where: { id: infraID },
    });

    if (!infra)
      throw new HttpException(404, `Couldn't find infrastructure ${infraID}`);
    return infra;
  };

  public getAllInfras = async () => {
    let infras: InfrastructureEntity[];
    infras = await this.infrasRepo.find();
    if (!infras) throw new HttpException(404, `Couldn't get infrastructures`);
    return infras;
  };
}

export default InfrastructureService;
