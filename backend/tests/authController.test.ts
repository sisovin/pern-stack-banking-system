import request from 'supertest';
import app from '../src/index';
import db from '../src/config/database';
import { users } from '../src/models/User';

describe('Auth Controller', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');

      const user = await db.select().from(users).where(users.email.eq('testuser@example.com')).single();
      expect(user).toBeDefined();
      expect(user.username).toBe('testuser');
    });

    it('should return an error if email is already in use', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          email: 'testuser@example.com',
          password: 'password123',
        });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser3',
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error registering user');
    });
  });

  describe('POST /login', () => {
    it('should log in an existing user', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser4',
          email: 'testuser4@example.com',
          password: 'password123',
        });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser4@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it('should return an error if email or password is incorrect', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
