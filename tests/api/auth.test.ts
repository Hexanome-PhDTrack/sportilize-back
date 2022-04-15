import fetch, { RequestInit } from 'node-fetch-commonjs';
import { UserEntity } from '../../src/databaseEntities/UserEntity';
import { UserAuthEntity } from '../../src/databaseEntities/UserAuthEntity';
import LoginDto from '../../src/dataTransfertObject/LoginDto';

const BASE_URL = 'http://localhost:3000/api';
const API_VESRION = 'v1';

describe('Auth API endpoint test', () => {
  const endpoint = 'auth';
  it('should register a new user and log him for 1 hour.', async () => {
    const resource = 'register';
    const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;
    const randomstring = (Math.random() * 1000000).toString();
    const userData: UserAuthEntity = {
      guid: 'existingUser',
      username: 'jestTestRegister',
      password: 'jestTest123',
      email: `test${randomstring}@mail.com`,
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
    let jsonRes;
    try {
      jsonRes = await response.json();
    } catch (e) {
      console.log(e);
    }
    expect(response.status).toBe(200);
    let cookie = response.headers.get('Set-Cookie');
    expect(cookie.split('Max-Age=')[1]).toBe('3600');
  });

  it('should reject registration with an existing email.', async () => {
    const resource = 'register';
    const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;
    const userData: UserAuthEntity = {
      guid: 'existingUser',
      username: 'jestTestRegister',
      password: 'jestTest123',
      email: 'test@mail.com',
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
    let jsonRes;
    try {
      jsonRes = await response.json();
    } catch (e) {
      console.log(e);
    }
    expect(response.status).toBe(400);
    expect(jsonRes.message).toBe(
      'User with email test@mail.com already exists',
    );
  });

  it('should login a user for 1 hour.', async () => {
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
    let cookie = response.headers.get('Set-Cookie');
    expect(cookie.split('Max-Age=')[1]).toBe('3600');
  });

  it('should login and logout a user.', async () => {
    //Login
    let resource = 'login';
    let url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;
    const userData: LoginDto = {
      password: 'jestTest123',
      email: 'test@mail.com',
    };

    let options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };

    let response = await fetch(url, options);
    let jsonRes;
    try {
      jsonRes = await response.json();
    } catch (e) {
      console.log(e);
    }
    expect(response.status).toBe(200);
    let cookie = response.headers.get('Set-Cookie');
    expect(cookie.split('Max-Age=')[1]).toBe('3600');

    //Logout
    resource = 'logout';
    url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;
    options = {
      method: 'POST',
    };

    response = await fetch(url, options);
    expect(response.status).toBe(200);
    expect(response.headers.get('Set-Cookie')).not.toBeUndefined();

    cookie = response.headers.get('Set-Cookie');
    expect(cookie).toBe('Authorization=;Max-age=0');
  });

  it('should change an existing user password.', async () => {
    //Login
    let resource = 'change_password';
    let url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;
    const changePasswordData = {
      oldPassword: 'jestTest123',
      newPassword: 'jestTest123',
      email: 'test@mail.com',
    };

    let options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(changePasswordData),
    };

    let response = await fetch(url, options);
    expect(response.status).toBe(204);
  });
});
