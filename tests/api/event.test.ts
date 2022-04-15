import fetch, { RequestInit } from 'node-fetch-commonjs';
import { UserEntity } from '../../src/databaseEntities/UserEntity';
import { UserAuthEntity } from '../../src/databaseEntities/UserAuthEntity';
import LoginDto from '../../src/dataTransfertObject/LoginDto';

const BASE_URL = 'http://localhost:3000/api';
const API_VESRION = 'v1';
const endpoint = 'events';

describe('event create API endpoint test', () => {
  const resource = 'create';
  it("should fail because we aren't connected.", async () => {
    const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;
  });
});
