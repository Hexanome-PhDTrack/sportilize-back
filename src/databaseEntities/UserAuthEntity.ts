import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './UserEntity';
import { EventEntity } from './EventEntity';

@Entity()
export class UserAuthEntity extends UserEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany('EventEntity', 'userAuthEntity', {})
  eventsCreated: EventEntity[];
}
