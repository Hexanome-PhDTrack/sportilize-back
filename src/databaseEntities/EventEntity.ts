import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  infrastructure: string;

  creator: string;

  participants: string[];

  sports: string[];

  description: string;

  beginDate: string;

  closed: boolean;

  review: string;
}
