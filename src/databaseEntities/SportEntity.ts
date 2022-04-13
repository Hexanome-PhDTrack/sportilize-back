import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventEntity } from './EventEntity';
import { InfrastructureEntity } from './InfrastructureEntity';

@Entity()
export class SportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(type => EventEntity, event => event.sports, {})
  EventRelated: EventEntity[];

  @ManyToMany(
    type => InfrastructureEntity,
    infrastructure => infrastructure.sports,
    {},
  )
  infrastructuresRelated: InfrastructureEntity[];
}
