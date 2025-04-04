import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/database';
import { users, NewUser, User } from '../models/User';

class AuthService {
  /**
   * Register a new user
   * @param username User's username
   * @param email User's email
   * @param password User's plain password
   * @returns The newly created user
   */
  async register(username: string, email: string, password: string): Promise<{ message: string }> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser: NewUser = {
      username,
      email,
      password: hashedPassword,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      roleIds: [1], // Assuming 1 is the default user role
    };

    await db.insert(users).values(newUser);
    
    return { message: 'User registered successfully' };
  }

  /**
   * Login a user and generate JWT token
   * @param email User's email
   * @param password User's plain password
   * @returns Token and user info if credentials are valid
   */
  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await db.select().from(users).where(users.email.eq(email)).single();

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return { token };
  }

  /**
   * Get user by ID
   * @param userId The user's ID
   * @returns User object if found
   */
  async getUserById(userId: number): Promise<User> {
    const user = await db.select().from(users).where(users.id.eq(userId)).single();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
}

export default new AuthService();