import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany,
  JoinTable,
  OneToMany,
  Index,
} from 'typeorm';
import { Point } from 'geojson';
import { SportEntity } from './SportEntity';
import { EventEntity } from './EventEntity';

@Entity()
export class InfrastructureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(type => SportEntity, sport => sport.infrastructuresRelated, {
    eager: true,
  })
  @JoinTable()
  sports: SportEntity[];

  @Index({ spatial: true })
  @Column({
    type: 'point',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  coordinates: Point;

  @Column()
  creator: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @OneToMany(() => EventEntity, event => event.infrastructure, {})
  eventsRelated: EventEntity[];

  @Column()
  occupiedHours: string;
}
