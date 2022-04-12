import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Unique(['username'])
export class UserAuthEntity {
  // id: string;
  // name: string;
  // authenticated: boolean;
  //
  // constructor(id: string, name: string) {
  //   this.id = id;
  //   this.name = name;
  //   this.authenticated = false;
  // }

  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: false,
    length: 60,
    name: 'username',
  })
  username: string;

  @Column('character varying', {
    nullable: false,
    length: 80,
    name: 'email',
  })
  email: string;

  @Column('integer', {
    nullable: true,
    name: 'RoleID',
  })
  RoleID: number | null;

  @Column('character varying', {
    nullable: false,
    length: 40,
    name: 'password',
  })
  password: string;
}
