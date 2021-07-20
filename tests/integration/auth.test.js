
const request = require('supertest');
const {User} = require('../../models/user');

let server;

describe('auth middleware', () => {
  const execute = (token) => {
    return request(server)
      .post('/api/v1/products')
      .set('authorization', token)
      .send()
  }
  beforeEach(() => {
    server = require('../../app');
  });
  afterEach(() => {
    server.close();
  });
  it('should return status 400 - Bad Request when no token is provided', async () => {
    const token = 'Bearer '; //invalid token
    const response = await execute(token);
    expect(response.status).toBe(401);
  });
})

