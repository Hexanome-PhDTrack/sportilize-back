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
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => EventEntity, event => event.creator, {})
  eventsCreated: EventEntity[];
}
