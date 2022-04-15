import fetch, { RequestInit } from 'node-fetch-commonjs';
import { UserEntity } from '../../src/databaseEntities/UserEntity';
import { UserAuthEntity } from '../../src/databaseEntities/UserAuthEntity';
import LoginDto from '../../src/databaseEntities/LoginDto';
import { v4 as uuidv4 } from 'uuid';

const BASE_URL = 'https://sportilize.herokuapp.com/api';
const API_VESRION = 'v1';
var cookie;

describe('User Auth API endpoint test', () => {
  const endpoint = 'users_auth';

  describe('User API unauthenticated tests', () => {
    it('should create an unauthenticated user', async () => {
      const resource = 'new_user';
      const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;
      const uuid = uuidv4();
      const newUser = {
        uuid: uuid,
        username: 'test' + uuid,
      };
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      };

      const response = await fetch(url, options);
      let jsonRes;
      try {
        jsonRes = await response.json();
      } catch (e) {
        console.log(e);
      }
      expect(response.status).toBe(201);
      expect(jsonRes).toEqual({
        uuid: uuid,
        username: 'test' + uuid,
        role: '',
      });
    });
    it('should return user information', async () => {
      const resource = 'info';
      const queryParams = {
        uuid: 'existingUser',
      };
      const params = new URLSearchParams(queryParams);
      const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}?${params}`;

      const options: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(url, options);
      let jsonRes;
      try {
        jsonRes = await response.json();
      } catch (e) {
        console.log(e);
      }
      expect(response.status).toBe(200);
      expect(jsonRes).toEqual({
        uuid: 'existingUser',
        username: 'jestTestRegister',
        email: 'test@mail.com',
        role: 'member',
      });
    });
  });

  //AUTHENTICATED REQUESTS//
  describe('Authenticated API calls', () => {
    beforeEach(async () => {
      const endpoint = 'auth';
      const resource = 'login';
      const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;
      const userData: LoginDto = {
        password: 'jestTest123',
        email: 'test@mail.com',
      };

      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      };

      const response = await fetch(url, options);
      let jsonRes;
      try {
        jsonRes = await response.json();
      } catch (e) {
        console.log(e);
      }
      expect(response.status).toBe(200);
      cookie = response.headers.get('Set-Cookie');
      expect(cookie.split('Max-Age=')[1]).toBe('3600');
    });

    it('should authorize an authenticated request', async () => {
      console.log(cookie);
      const resource = 'user_events';
      const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;

      const options: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
      };

      const response = await fetch(url, options);
      let jsonRes;
      try {
        jsonRes = await response.json();
      } catch (e) {
        console.log(e);
      }
    });
  });
});
