export class User {
  id: string;
  name: string;
  authenticated: boolean;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.authenticated = false;
  }
}
