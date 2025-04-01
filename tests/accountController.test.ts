import request from 'supertest';
import app from '../src/index';
import db from '../src/config/database';
import { accounts } from '../src/models/Account';

describe('Account Management Endpoints', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('POST /accounts', () => {
    it('should create a new account', async () => {
      const res = await request(app)
        .post('/accounts')
        .send({
          type: 'savings',
          status: 'active',
          balance: 1000,
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
    });
  });

  describe('GET /accounts/:id', () => {
    it('should get an account by id', async () => {
      const account = await db.insert(accounts).values({
        type: 'checking',
        status: 'active',
        balance: 500,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning().first();

      const res = await request(app).get(`/accounts/${account.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', account.id);
    });
  });

  describe('PUT /accounts/:id', () => {
    it('should update an account by id', async () => {
      const account = await db.insert(accounts).values({
        type: 'checking',
        status: 'active',
        balance: 500,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning().first();

      const res = await request(app)
        .put(`/accounts/${account.id}`)
        .send({
          type: 'checking',
          status: 'frozen',
          balance: 500,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'frozen');
    });
  });

  describe('DELETE /accounts/:id', () => {
    it('should delete an account by id', async () => {
      const account = await db.insert(accounts).values({
        type: 'checking',
        status: 'active',
        balance: 500,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning().first();

      const res = await request(app).delete(`/accounts/${account.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Account deleted successfully');
    });
  });
});
