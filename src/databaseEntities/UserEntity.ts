import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany,
} from 'typeorm';
import { EventEntity } from './EventEntity';

export const DEFAULT_USER_ROLE: string = '';

// @Unique(['username'])
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  uuid: string;

  @Column()
  username: string;

  @Column()
  role: string;

  @ManyToMany('EventEntity', 'userEntity', {})
  participatesToEvents?: EventEntity[];
}
