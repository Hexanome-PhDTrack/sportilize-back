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

  @ManyToOne(() => InfrastructureEntity, infra => infra.eventsRelated, {
    eager: true,
  })
  infrastructure: InfrastructureEntity;

  @ManyToOne(() => UserAuthEntity, user => user.eventsCreated, {
    eager: true,
  })
  creator: UserAuthEntity;

  @ManyToMany(type => UserEntity, user => user.participatesToEvents, {
    eager: true,
  })
  @JoinTable()
  participants: UserEntity[];

  @Column()
  nbMaxParticipants: number;

  @ManyToMany(type => SportEntity, sport => sport.EventRelated, {
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
