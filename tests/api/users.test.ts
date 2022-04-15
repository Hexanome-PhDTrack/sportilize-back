import fetch, { RequestInit } from 'node-fetch-commonjs';
import { UserEntity } from '../../src/databaseEntities/UserEntity';
import { UserAuthEntity } from '../../src/databaseEntities/UserAuthEntity';
import { v4 as uuidv4 } from 'uuid';
import LoginDto from '../../src/dataTransfertObject/LoginDto';

const BASE_URL = 'https://sportilize.herokuapp.com/api';
const API_VESRION = 'v1';

describe('User API unauthenticated tests', () => {
  const endpoint = 'users';
  const uuid = uuidv4();

  it('should create an unauthenticated user', async () => {
    const resource = 'new_user';
    const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;
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
      uuid: uuid,
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
      uuid: uuid,
      username: 'test' + uuid,
      role: '',
    });
  });

  //EVENTS SUBSCRIPTION//
});
