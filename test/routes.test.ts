import * as supertest from 'supertest';
import { app } from '../src/app';

describe('GET /', () => {
  it('should return 200 OK', () => {
    supertest(app).get('/').expect(200);
  });
});
describe('GET /login', () => {
  it('should return 200 OK', () => {
    supertest(app).get('/login').expect(200);
  });
});
describe('GET /logout', () => {
  it('should return 302 OK', () => {
    supertest(app).get('/logout').expect(302);
  });
});
describe('GET /recover', () => {
  it('should return 200 OK', () => {
    supertest(app).get('/recover').expect(200);
  });
});
