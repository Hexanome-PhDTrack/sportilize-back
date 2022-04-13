import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Unique(['username'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  role: string;
}
