import { User } from './User';

export class AuthUser extends User {
  constructor(id, name) {
    super(id, name);
    this.authenticated = true;
  }
}
