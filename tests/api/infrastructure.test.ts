import fetch, { RequestInit } from 'node-fetch-commonjs';
import { UserEntity } from '../../src/databaseEntities/UserEntity';
import { UserAuthEntity } from '../../src/databaseEntities/UserAuthEntity';
import CreateEventInput from '../../src/inputClasses/CreateEventInput';
import LoginDto from '../../src/dataTransfertObject/LoginDto';
import GetInfrastructureInput from '../../src/inputClasses/GetInfrastructureInput';
import GetInfrastructuresbyAreaInput from '../../src/inputClasses/GetInfrastructuresByAreaInput';

const BASE_URL = 'http://localhost:3000/api';
const API_VESRION = 'v1';
const endpoint = 'infrastructures';

describe('infrastructures get API endpoint test', () => {
  let resource = 'get';
  it('Get an infrastructure with an id', async () => {
    const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;

    const getInfra: GetInfrastructureInput = {
      infrastructureId: 46398774,
    };

    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(getInfra),
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

  resource = 'getByArea';
  it('Get an infrastructure with an id', async () => {
    const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;

    const getInfra: GetInfrastructuresbyAreaInput = {
      lat: 45.783333, //insa campus
      long: 4.87442,
      distanceMax: 500,
    };

    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(getInfra),
    };

    const response = await fetch(url, options);

    let jsonRes;
    try {
      jsonRes = await response.json();
      console.log(jsonRes);
    } catch (e) {
      console.log(e);
    }

    expect(response.status).toBe(200);
  });
});
