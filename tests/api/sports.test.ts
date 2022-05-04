import fetch, { RequestInit } from 'node-fetch-commonjs';

const BASE_URL =
  process.env.NODE_ENV === 'test'
    ? 'http://localhost:3000/api'
    : 'https://sportilize.herokuapp.com/api';
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

    // expect(jsonRes.length).toBe(55);
    expect(response.status).toBe(200);
  });
});
