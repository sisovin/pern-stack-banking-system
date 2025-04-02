import request from 'supertest';
import app from '../src/index';
import db from '../src/config/database';
import { transactions } from '../src/models/Transaction';

describe('Transaction Endpoints', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('POST /transactions', () => {
    it('should create a new transaction', async () => {
      const res = await request(app)
        .post('/transactions')
        .send({
          type: 'deposit',
          status: 'pending',
          amount: 1000,
          accountId: 1,
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
    });
  });

  describe('GET /transactions/:id', () => {
    it('should get a transaction by id', async () => {
      const transaction = await db.insert(transactions).values({
        type: 'withdrawal',
        status: 'completed',
        amount: 500,
        accountId: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning().first();

      const res = await request(app).get(`/transactions/${transaction.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', transaction.id);
    });
  });

  describe('PUT /transactions/:id', () => {
    it('should update a transaction by id', async () => {
      const transaction = await db.insert(transactions).values({
        type: 'withdrawal',
        status: 'pending',
        amount: 500,
        accountId: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning().first();

      const res = await request(app)
        .put(`/transactions/${transaction.id}`)
        .send({
          type: 'withdrawal',
          status: 'completed',
          amount: 500,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'completed');
    });
  });

  describe('DELETE /transactions/:id', () => {
    it('should delete a transaction by id', async () => {
      const transaction = await db.insert(transactions).values({
        type: 'withdrawal',
        status: 'pending',
        amount: 500,
        accountId: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning().first();

      const res = await request(app).delete(`/transactions/${transaction.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Transaction deleted successfully');
    });
  });

  describe('POST /transactions/:id/authorize', () => {
    it('should authorize a transaction by id', async () => {
      const transaction = await db.insert(transactions).values({
        type: 'deposit',
        status: 'pending',
        amount: 1000,
        accountId: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning().first();

      const res = await request(app).post(`/transactions/${transaction.id}/authorize`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'authorized');
    });
  });

  describe('POST /transactions/:id/reject', () => {
    it('should reject a transaction by id', async () => {
      const transaction = await db.insert(transactions).values({
        type: 'deposit',
        status: 'pending',
        amount: 1000,
        accountId: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning().first();

      const res = await request(app).post(`/transactions/${transaction.id}/reject`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'rejected');
    });
  });
});
