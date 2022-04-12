import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

export class EventEntity {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  //TODO
}
