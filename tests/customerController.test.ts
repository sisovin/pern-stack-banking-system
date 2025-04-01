import request from 'supertest';
import app from '../src/index';
import db from '../src/config/database';
import { customers } from '../src/models/Customer';

describe('Customer Controller', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('POST /customers', () => {
    it('should create a new customer', async () => {
      const newCustomer = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        address: '123 Main St',
        dateOfBirth: '1990-01-01',
        kycStatus: 'verified',
      };

      const response = await request(app)
        .post('/customers')
        .send(newCustomer)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.firstName).toBe(newCustomer.firstName);
      expect(response.body.lastName).toBe(newCustomer.lastName);
      expect(response.body.email).toBe(newCustomer.email);
    });
  });

  describe('GET /customers/:id', () => {
    it('should retrieve a customer by ID', async () => {
      const newCustomer = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phoneNumber: '0987654321',
        address: '456 Main St',
        dateOfBirth: '1992-02-02',
        kycStatus: 'verified',
      };

      const createdCustomer = await db
        .insert(customers)
        .values(newCustomer)
        .returning()
        .then((rows) => rows[0]);

      const response = await request(app)
        .get(`/customers/${createdCustomer.id}`)
        .expect(200);

      expect(response.body.id).toBe(createdCustomer.id);
      expect(response.body.firstName).toBe(newCustomer.firstName);
      expect(response.body.lastName).toBe(newCustomer.lastName);
      expect(response.body.email).toBe(newCustomer.email);
    });
  });

  describe('PUT /customers/:id', () => {
    it('should update a customer by ID', async () => {
      const newCustomer = {
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice.smith@example.com',
        phoneNumber: '1112223333',
        address: '789 Main St',
        dateOfBirth: '1993-03-03',
        kycStatus: 'verified',
      };

      const createdCustomer = await db
        .insert(customers)
        .values(newCustomer)
        .returning()
        .then((rows) => rows[0]);

      const updatedCustomer = {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        phoneNumber: '1112223333',
        address: '789 Main St',
        dateOfBirth: '1993-03-03',
        kycStatus: 'verified',
      };

      const response = await request(app)
        .put(`/customers/${createdCustomer.id}`)
        .send(updatedCustomer)
        .expect(200);

      expect(response.body.id).toBe(createdCustomer.id);
      expect(response.body.firstName).toBe(updatedCustomer.firstName);
      expect(response.body.lastName).toBe(updatedCustomer.lastName);
      expect(response.body.email).toBe(updatedCustomer.email);
    });
  });

  describe('DELETE /customers/:id', () => {
    it('should delete a customer by ID', async () => {
      const newCustomer = {
        firstName: 'Bob',
        lastName: 'Brown',
        email: 'bob.brown@example.com',
        phoneNumber: '4445556666',
        address: '101 Main St',
        dateOfBirth: '1994-04-04',
        kycStatus: 'verified',
      };

      const createdCustomer = await db
        .insert(customers)
        .values(newCustomer)
        .returning()
        .then((rows) => rows[0]);

      await request(app)
        .delete(`/customers/${createdCustomer.id}`)
        .expect(200);

      const deletedCustomer = await db
        .select()
        .from(customers)
        .where(customers.id.eq(createdCustomer.id))
        .single();

      expect(deletedCustomer).toBeUndefined();
    });
  });
});
