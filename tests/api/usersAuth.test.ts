import fetch, { RequestInit } from 'node-fetch-commonjs';
import { UserEntity } from '../../src/databaseEntities/UserEntity';
import { UserAuthEntity } from '../../src/databaseEntities/UserAuthEntity';
import LoginDto from '../../src/dataTransfertObject/LoginDto';
import { v4 as uuidv4 } from 'uuid';

const BASE_URL =
  process.env.NODE_ENV === 'test'
    ? 'http://localhost:3000/api'
    : 'https://sportilize.herokuapp.com/api';
const API_VESRION = 'v1';
var cookie;

describe('User Auth API endpoint test', () => {
  const endpoint = 'users_auth';

  describe('User API unauthenticated tests', () => {
    it('should return user information', async () => {
      const resource = 'info';
      const queryParams = {
        email: 'test@mail.com',
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
    beforeAll(async () => {
      const endpoint = 'auth';
      const resource = 'register';
      const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;
      const userData: UserAuthEntity = {
        uuid: `existingUserToDelete`,
        username: 'jestTestRegister',
        password: 'jestTest123',
        email: `testToDelete@mail.com`,
        role: 'member',
      };

      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      };
      const response = await fetch(url, options);
      cookie = response.headers.get('Set-Cookie');
    });

    it('should edit user info', async () => {
      jest.setTimeout(10000);
      const resource = 'edit';
      const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;

      const editedData = {
        uuid: 'existingUserToDelete',
        username: 'jestTestRegisterEdited',
        email: 'testToDelete@mail.com',
        role: 'member',
      };
      const options: RequestInit = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
        body: JSON.stringify(editedData),
      };

      const response = await fetch(url, options);
      expect(response.status).toBe(204);
    });

    it('should discard user edits', async () => {
      jest.setTimeout(10000);
      const resource = 'edit';
      const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;

      const editedData = {
        uuid: 'existingUserToDelete',
        username: 'jestTestRegister',
        email: 'testToDelete@mail.com',
        role: 'member',
      };
      const options: RequestInit = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
        body: JSON.stringify(editedData),
      };

      const response = await fetch(url, options);
      expect(response.status).toBe(204);
    });

    it("should delete a user's account", async () => {
      jest.setTimeout(10000);
      const resource = 'delete';
      const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;

      const deleteData = {
        email: 'testToDelete@mail.com',
        password: 'jestTest123',
      };
      const options: RequestInit = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
        body: JSON.stringify(deleteData),
      };

      const response = await fetch(url, options);
      expect(response.status).toBe(200);
    });
  });
});
