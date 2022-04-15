import fetch, { RequestInit } from 'node-fetch-commonjs';
import { UserEntity } from '../../src/databaseEntities/UserEntity';
import { UserAuthEntity } from '../../src/databaseEntities/UserAuthEntity';
import LoginDto from '../../src/dataTransfertObject/LoginDto';

const BASE_URL = 'http://localhost:3000/api';
const API_VESRION = 'v1';
var cookie;

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

describe('User API endpoint test', () => {
  const endpoint = 'users';
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
    console.log(jsonRes);
  });
});
