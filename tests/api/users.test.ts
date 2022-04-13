import fetch from 'node-fetch-commonjs';
const BASE_URL = 'http://localhost:3000/api';
const API_VESRION = 'v1';
describe('User API endpoint test', () => {
  test('tests /users endpoint', async () => {
    const endpoint = 'users';
    const resource = 'user_events';
    const url = `${BASE_URL}/${API_VESRION}/${endpoint}/${resource}`;
    console.log(url);
    const response = await fetch(url);
    try {
      const jsonRes = await response.json();
    } catch (e) {
      console.log(e);
    }
    expect(response.status).toBe(200);
  });

  // Insert other tests below this line

  // Insert other tests above this line
});
