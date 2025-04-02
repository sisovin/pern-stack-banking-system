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

  describe('GET /financial-statements', () => {
    it('should generate financial statements for a given date range', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';

      const res = await request(app).get(`/financial-statements?startDate=${startDate}&endDate=${endDate}`);
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('should return 500 if there is an error generating financial statements', async () => {
      const res = await request(app).get('/financial-statements?startDate=invalid&endDate=invalid');
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to generate financial statements');
    });
  });

  describe('GET /reports', () => {
    it('should generate reports for a given type and date range', async () => {
      const reportType = 'summary';
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';

      const res = await request(app).get(`/reports?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}`);
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('should return 500 if there is an error generating reports', async () => {
      const res = await request(app).get('/reports?reportType=invalid&startDate=invalid&endDate=invalid');
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to generate reports');
    });
  });
});
