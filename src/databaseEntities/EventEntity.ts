import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  infrastructure: string;

  @Column()
  creator: string;

  // @Column()
  // participants: string[];

  // @Column()
  // sports: string[];

  @Column()
  description: string;

  @Column()
  beginDate: string;

  @Column()
  closed: boolean;

  @Column()
  review: string;
}
