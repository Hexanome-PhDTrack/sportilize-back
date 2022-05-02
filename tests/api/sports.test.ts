import fetch, { RequestInit } from 'node-fetch-commonjs';
import { UserEntity } from '../../src/databaseEntities/UserEntity';
import { UserAuthEntity } from '../../src/databaseEntities/UserAuthEntity';
import LoginDto from '../../src/databaseEntities/LoginDto';

const BASE_URL = 'https://sportilize.herokuapp.com/api';
// const BASE_URL = "http://localhost:3000/api"
const API_VESRION = 'v1';

describe('Sports API endpoint test', () => {
  const endpoint = 'sports';

  it('should get a sport named "Golf".', async () => {
    const resource = 'get_sport';
    const queryParams = {
      sportName: 'Golf',
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
    expect(jsonRes).toStrictEqual({ id: 392, name: 'Golf' });
  });

  it('should get all sports.', async () => {
    const resource = 'get_all_sports';
    const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;
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
  });
});
