import fetch, { RequestInit } from 'node-fetch-commonjs';
import { UserEntity } from '../../src/databaseEntities/UserEntity';
import { UserAuthEntity } from '../../src/databaseEntities/UserAuthEntity';
import CreateEventInput from '../../src/inputClasses/CreateEventInput';
import LoginDto from '../../src/dataTransfertObject/LoginDto';

const BASE_URL =
  process.env.NODE_ENV === 'test'
    ? 'http://localhost:3000/api'
    : 'https://sportilize.herokuapp.com/api';
const API_VESRION = 'v1';
const endpoint = 'events';
const authEndpoint = 'auth';

describe('event create API endpoint test', () => {
  const resource = 'create';
  it("should fail because we aren't connected.", async () => {
    const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;

    const createEvent: CreateEventInput = {
      infrastructureId: 178113406,
      name: 'un event de test',
      nbMaxParticipants: 10,
      sports: ['Judo '],
      description: 'une description de test',
      beginDate: Date.now().toString(),
      endDate: (Date.now() + 60 * 1000).toString(),
    };

    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createEvent),
    };

    const response = await fetch(url, options);
    expect(response.status).toBe(403);
  });

  it('Should connect and create a new event.', async () => {
    const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;

    // connection
    const resourceCon = 'login';
    const urlCon = `${BASE_URL}/${API_VESRION}/${authEndpoint}/${resourceCon}`;
    const userData: LoginDto = {
      password: 'jestTest123',
      email: 'test@mail.com',
    };

    const optionsCon: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };

    const response = await fetch(urlCon, optionsCon);
    let jsonRes;
    try {
      jsonRes = await response.json();
    } catch (e) {
      console.log(e);
    }
    expect(response.status).toBe(200);
    let cookie = response.headers.get('Set-Cookie');
    expect(cookie.split('Max-Age=')[1]).toBe('3600');

    // create event
    const createEvent: CreateEventInput = {
      infrastructureId: 247058027,
      name: 'un event de test',
      nbMaxParticipants: 10,
      sports: ['Football'],
      description: 'une description de test',
      beginDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 60 * 1000).toISOString(),
    };
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify(createEvent),
    };

    const createResponse = await fetch(url, options);
    expect(createResponse.status).toBe(200);
  });
});
