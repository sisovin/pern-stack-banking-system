import request from 'supertest';
import app from '../src/index';
import db from '../src/config/database';
import { journalEntries } from '../src/models/JournalEntry';

describe('Ledger Controller', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('POST /ledger', () => {
    it('should post a new journal entry to the ledger', async () => {
      const response = await request(app)
        .post('/api/ledger')
        .send({
          accountId: 1,
          debit: 100,
          credit: 100,
          description: 'Test entry',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');

      const entry = await db.select().from(journalEntries).where(journalEntries.id.eq(response.body.id)).single();
      expect(entry).toBeDefined();
      expect(entry.accountId).toBe(1);
      expect(entry.debit).toBe(100);
      expect(entry.credit).toBe(100);
      expect(entry.description).toBe('Test entry');
    });

    it('should return an error if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/ledger')
        .send({
          accountId: 1,
          debit: 100,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('All fields are required');
    });

    it('should return an error if posting to the ledger fails', async () => {
      jest.spyOn(db, 'insert').mockImplementationOnce(() => {
        throw new Error('Failed to post to ledger');
      });

      const response = await request(app)
        .post('/api/ledger')
        .send({
          accountId: 1,
          debit: 100,
          credit: 100,
          description: 'Test entry',
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to post to ledger');
    });
  });
});
