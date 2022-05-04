import fetch, { RequestInit } from 'node-fetch-commonjs';
import { UserEntity } from '../../src/databaseEntities/UserEntity';
import { UserAuthEntity } from '../../src/databaseEntities/UserAuthEntity';
import CreateEventInput from '../../src/inputClasses/CreateEventInput';
import LoginDto from '../../src/dataTransfertObject/LoginDto';
import ParticipateToEventInput from '../../src/inputClasses/ParticipateToEventInput';
import CloseEventInput from '../../src/inputClasses/CloseEventInput';

const BASE_URL =
  process.env.NODE_ENV === 'test'
    ? 'http://localhost:3000/api'
    : 'https://sportilize.herokuapp.com/api';
const API_VESRION = 'v1';
const endpoint = 'events';
const authEndpoint = 'auth';

describe('events API endpoint test', () => {
  describe('Events interaction with logged in user', () => {
    var cookie, userId;
    beforeAll(async () => {
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
      cookie = response.headers.get('Set-Cookie');
      userId = jsonRes.id;
    });

    var eventId;
    it('Should connect and create a new event.', async () => {
      const resource = 'create';
      const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;
      // create event
      const createEvent: CreateEventInput = {
        infrastructureId: 247058027,
        name: 'un event de test',
        nbMaxParticipants: 10,
        sports: ['Football'],
        description: 'une description de test',
        beginDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      };
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
        body: JSON.stringify(createEvent),
      };

      const response = await fetch(url, options);
      let jsonRes;
      try {
        jsonRes = await response.json();
      } catch (e) {}
      eventId = jsonRes.id;
      expect(response.status).toBe(200);
    });

    it('should close the previous event', async () => {
      const resource = 'close';
      const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;
      // closing event
      const closeEvent: CloseEventInput = {
        eventId: eventId,
        endDate: new Date().toISOString(),
        review: 'Great',
      };
      const options: RequestInit = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
        body: JSON.stringify(closeEvent),
      };
      const response = await fetch(url, options);
      let jsonRes;
      try {
        jsonRes = await response.json();
      } catch (e) {}
      expect(response.status).toBe(200);
    });

    it('Should get all the events created by the user.', async () => {
      const getOrganizedResource = 'get_organized_by_user';
      // get event
      const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${getOrganizedResource}`;
      const options: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
      };

      const getResponse = await fetch(url, options);
      let jsonRes;
      try {
        jsonRes = await getResponse.json();
      } catch (e) {
        console.log(e);
      }
      expect(jsonRes.length).toBeGreaterThan(0);
      expect(getResponse.status).toBe(200);
    });
  });

  describe('Events interaction with unlogged user', () => {
    it("should fail because we aren't connected.", async () => {
      const createResource = 'create';
      const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${createResource}`;

      const createEvent: CreateEventInput = {
        infrastructureId: 247058027,
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

    it('Should participate to an event', async () => {
      const participateResource = 'participate';

      const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${participateResource}`;
      // create event
      const participateOption: ParticipateToEventInput = {
        userUuid: '18c0a621-59e3-4800-8061-f07f94477d56',
        eventId: 1,
      };
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(participateOption),
      };
      const response = await fetch(url, options);
      expect(response.status).toBe(200);
    });

    it('Should list all event which the user participate', async () => {
      const getParticipateResource = 'get_events_to_participate';
      const queryParams: any = {
        uuid: '18c0a621-59e3-4800-8061-f07f94477d56',
      };

      const params = new URLSearchParams(queryParams).toString();
      const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${getParticipateResource}?${params}`;

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
      expect(response.status).toBe(200);
      expect(jsonRes.length).toBeGreaterThan(0);
    });
  });

  describe('Public endpoints', () => {
    it('Should get all open events for this infra.', async () => {
      const resource = 'list_events_not_closed_by_infrastructure';
      const queryParams: any = {
        id: 247058027,
      };

      const params = new URLSearchParams(queryParams).toString();
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
      } catch (e) {}
      expect(jsonRes.length).toBeGreaterThan(0);
      expect(response.status).toBe(200);
    });
  });
});
