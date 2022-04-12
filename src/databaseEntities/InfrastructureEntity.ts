import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

export class InfrastructureEntity {
  @PrimaryGeneratedColumn()
  coordinates: number[];

  creator: string;

  name: string;

  address: string;

  occupiedHours: number[];
}
