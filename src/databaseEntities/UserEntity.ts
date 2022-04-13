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
  username: string;

  @Column()
  role: string;

  @ManyToMany(type => EventEntity, event => event.participants, {})
  participatesToEvents: EventEntity[];
}
