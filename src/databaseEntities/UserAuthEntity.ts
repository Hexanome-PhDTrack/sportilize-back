import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity()
export class UserAuthEntity extends UserEntity {
  @Column()
  email: string;

  @Column()
  password: string;
}
