import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export class UserNotAuth {
  // id: string;
  // name: string;
  // authenticated: boolean;
  //
  // constructor(id: string, name: string) {
  //   this.id = id;
  //   this.name = name;
  //   this.authenticated = false;
  // }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  role: string;

  @Column()
  authenticated: boolean;
}
