import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventEntity } from './EventEntity';
import { InfrastructureEntity } from './InfrastructureEntity';

@Entity()
export class SportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany('EventEntity', 'sportEntity', {})
  EventRelated: EventEntity[];

  @ManyToMany('InfrastructureEntity', 'sportEntity', {})
  infrastructuresRelated: InfrastructureEntity[];
}
