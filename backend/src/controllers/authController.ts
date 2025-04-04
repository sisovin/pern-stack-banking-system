import { Request, Response } from 'express';
import authService from '../services/authService';

const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const result = await authService.register(username, email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export { register, login };