import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../config/database';
import { blacklistedTokens } from '../models/BlacklistedToken';

const blacklistToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decodedToken.userId;

    await db.insert(blacklistedTokens).values({ token, userId, blacklistedAt: Date.now() });

    res.status(200).json({ message: 'Token blacklisted successfully' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error });
  }
};

const checkBlacklistedToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const blacklistedToken = await db.select().from(blacklistedTokens).where(blacklistedTokens.token.eq(token)).single();

    if (blacklistedToken) {
      return res.status(401).json({ message: 'Token is blacklisted' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking token', error });
  }
};

export { blacklistToken, checkBlacklistedToken };
