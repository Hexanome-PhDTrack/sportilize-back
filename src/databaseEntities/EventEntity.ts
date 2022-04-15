import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './UserEntity';
import { SportEntity } from './SportEntity';
import { UserAuthEntity } from './UserAuthEntity';
import { InfrastructureEntity } from './InfrastructureEntity';

@Entity()
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('InfrastructureEntity', 'eventEntity', {
    eager: true,
  })
  infrastructure: InfrastructureEntity;

  @ManyToOne('UserAuthEntity', 'eventEntity', {
    eager: true,
  })
  creator: UserAuthEntity;

  @ManyToMany('UserEntity', 'eventEntity', {
    eager: true,
  })
  @JoinTable()
  participants: UserEntity[];

  @Column()
  nbMaxParticipants: number;

  @ManyToMany('SportEntity', 'eventEntity', {
    eager: true,
  })
  @JoinTable()
  sports: SportEntity[];

  @Column()
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  beginDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column()
  closed: boolean;

  @Column()
  review: string;
}
