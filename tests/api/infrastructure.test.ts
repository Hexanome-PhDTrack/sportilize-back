import fetch, { RequestInit } from 'node-fetch-commonjs';
import GetInfrastructuresbyAreaInput from '../../src/inputClasses/GetInfrastructuresByAreaInput';

const BASE_URL =
  process.env.NODE_ENV === 'test'
    ? 'http://localhost:3000/api'
    : 'https://sportilize.herokuapp.com/api';

const API_VESRION = 'v1';
const endpoint = 'infrastructures';

describe('infrastructures get API endpoint test', () => {
  it('should get a sport named "Terrain multisports".', async () => {
    const resource = 'get_infrastructure';
    const queryParams = {
      infraID: '102191319',
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
    expect(jsonRes).toStrictEqual({
      address: '0 Cité René Peillon, 69700 Givors',
      creator: 'sportilize',
      id: 102191319,
      name: 'Terrain Multisports',
      occupiedHours: '',
      point: '{"type":"Point","coordinates":["4.79472000","45.56838000"]}',
      sports: [
        {
          id: 819,
          name: 'Football',
        },
        {
          id: 2359,
          name: 'Football en salle (Futsal)',
        },
      ],
    });
  });

  it('Should get an infrastructure by area', async () => {
    const resource = 'get_by_area';

    const queryParams: any = {
      lat: 45.75043, //insa campus
      long: 4.87828,
      distanceMax: 500,
    };

    const params = new URLSearchParams(queryParams).toString();
    const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}?${params}`;
    console.log(url);

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
    } catch (e) {}
    expect(jsonRes.length).toBe(4);
    expect(response.status).toBe(200);
  });

  it('should get all infrastructures.', async () => {
    const resource = 'get_all_infrastructures';
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
    expect(jsonRes.length).toBe(314);
    expect(response.status).toBe(200);
  });
});
