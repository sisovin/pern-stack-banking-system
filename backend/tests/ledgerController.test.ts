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

  describe('GET /ledger', () => {
    it('should retrieve all ledger entries', async () => {
      const response = await request(app).get('/api/ledger');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it('should return an error if retrieving ledger entries fails', async () => {
      jest.spyOn(db, 'select').mockImplementationOnce(() => {
        throw new Error('Failed to retrieve ledger entries');
      });

      const response = await request(app).get('/api/ledger');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to retrieve ledger entries');
    });
  });

  describe('GET /ledger/:id', () => {
    it('should retrieve a ledger entry by ID', async () => {
      const newEntry = await db.insert(journalEntries).values({
        accountId: 1,
        debit: 100,
        credit: 100,
        description: 'Test entry',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning();

      const response = await request(app).get(`/api/ledger/${newEntry[0].id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', newEntry[0].id);
    });

    it('should return an error if ledger entry is not found', async () => {
      const response = await request(app).get('/api/ledger/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Ledger entry not found');
    });

    it('should return an error if retrieving ledger entry fails', async () => {
      jest.spyOn(db, 'select').mockImplementationOnce(() => {
        throw new Error('Failed to retrieve ledger entry');
      });

      const response = await request(app).get('/api/ledger/1');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to retrieve ledger entry');
    });
  });

  describe('PUT /ledger/:id', () => {
    it('should update a ledger entry', async () => {
      const newEntry = await db.insert(journalEntries).values({
        accountId: 1,
        debit: 100,
        credit: 100,
        description: 'Test entry',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning();

      const response = await request(app)
        .put(`/api/ledger/${newEntry[0].id}`)
        .send({
          accountId: 1,
          debit: 200,
          credit: 200,
          description: 'Updated entry',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', newEntry[0].id);

      const updatedEntry = await db.select().from(journalEntries).where(journalEntries.id.eq(newEntry[0].id)).single();
      expect(updatedEntry.debit).toBe(200);
      expect(updatedEntry.credit).toBe(200);
      expect(updatedEntry.description).toBe('Updated entry');
    });

    it('should return an error if ledger entry is not found', async () => {
      const response = await request(app)
        .put('/api/ledger/999')
        .send({
          accountId: 1,
          debit: 200,
          credit: 200,
          description: 'Updated entry',
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Ledger entry not found');
    });

    it('should return an error if updating ledger entry fails', async () => {
      jest.spyOn(db, 'update').mockImplementationOnce(() => {
        throw new Error('Failed to update ledger entry');
      });

      const response = await request(app)
        .put('/api/ledger/1')
        .send({
          accountId: 1,
          debit: 200,
          credit: 200,
          description: 'Updated entry',
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to update ledger entry');
    });
  });

  describe('DELETE /ledger/:id', () => {
    it('should delete a ledger entry', async () => {
      const newEntry = await db.insert(journalEntries).values({
        accountId: 1,
        debit: 100,
        credit: 100,
        description: 'Test entry',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).returning();

      const response = await request(app).delete(`/api/ledger/${newEntry[0].id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Ledger entry deleted successfully');

      const deletedEntry = await db.select().from(journalEntries).where(journalEntries.id.eq(newEntry[0].id)).single();
      expect(deletedEntry).toBeUndefined();
    });

    it('should return an error if ledger entry is not found', async () => {
      const response = await request(app).delete('/api/ledger/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Ledger entry not found');
    });

    it('should return an error if deleting ledger entry fails', async () => {
      jest.spyOn(db, 'delete').mockImplementationOnce(() => {
        throw new Error('Failed to delete ledger entry');
      });

      const response = await request(app).delete('/api/ledger/1');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to delete ledger entry');
    });
  });
});
