import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany,
} from 'typeorm';
import { EventEntity } from './EventEntity';

// @Unique(['username'])
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  guid: string;

  @Column()
  username: string;

  @Column()
  role: string;

  @ManyToMany('EventEntity', 'userEntity', {})
  participatesToEvents: EventEntity[];
}
