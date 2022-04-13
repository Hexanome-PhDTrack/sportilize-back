import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
export class InfrastructureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @PrimaryGeneratedColumn()
  // coordinates: number[];

  @Column()
  creator: string;

  @Column()
  name: string;

  @Column()
  address: string;

  // @Column()
  // occupiedHours: number[];
}
