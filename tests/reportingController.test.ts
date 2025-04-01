import request from 'supertest';
import app from '../src/index';
import db from '../src/config/database';
import { accounts } from '../src/models/Account';
import { transactions } from '../src/models/Transaction';

describe('Reporting Controller', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('GET /account-statement/:accountId', () => {
    it('should return account statement for a valid account', async () => {
      const account = await db.insert(accounts).values({
        type: 'savings',
        status: 'active',
        balance: 1000,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning('*');

      const transaction = await db.insert(transactions).values({
        type: 'deposit',
        status: 'completed',
        amount: 1000,
        accountId: account[0].id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning('*');

      const res = await request(app).get(`/account-statement/${account[0].id}`);
      expect(res.status).toBe(200);
      expect(res.body.account).toEqual(account[0]);
      expect(res.body.transactions).toEqual([transaction[0]]);
    });

    it('should return 404 for an invalid account', async () => {
      const res = await request(app).get('/account-statement/999');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Account not found');
    });
  });

  describe('GET /transaction-history/:accountId', () => {
    it('should return transaction history for a valid account', async () => {
      const account = await db.insert(accounts).values({
        type: 'savings',
        status: 'active',
        balance: 1000,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning('*');

      const transaction = await db.insert(transactions).values({
        type: 'deposit',
        status: 'completed',
        amount: 1000,
        accountId: account[0].id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning('*');

      const res = await request(app).get(`/transaction-history/${account[0].id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([transaction[0]]);
    });

    it('should return 404 for an invalid account', async () => {
      const res = await request(app).get('/transaction-history/999');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Account not found');
    });
  });

  describe('GET /customer-report/:customerId', () => {
    it('should return customer report for a valid customer', async () => {
      const account = await db.insert(accounts).values({
        type: 'savings',
        status: 'active',
        balance: 1000,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning('*');

      const transaction = await db.insert(transactions).values({
        type: 'deposit',
        status: 'completed',
        amount: 1000,
        accountId: account[0].id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning('*');

      const res = await request(app).get(`/customer-report/${account[0].customerId}`);
      expect(res.status).toBe(200);
      expect(res.body.accounts).toEqual([account[0]]);
      expect(res.body.transactions).toEqual([transaction[0]]);
    });

    it('should return 404 for an invalid customer', async () => {
      const res = await request(app).get('/customer-report/999');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Customer not found');
    });
  });
});
