import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../config/database';
import { users } from '../models/User';
import { roles } from '../models/Role';
import { permissions } from '../models/Permission';

const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
      const userId = decodedToken.userId;

      const user = await db.select().from(users).where(users.id.eq(userId)).single();

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const userRoles = await db.select().from(roles).where(roles.id.in(user.roleIds));
      const userPermissions = await db.select().from(permissions).where(permissions.id.in(userRoles.flatMap(role => role.permissionIds)));

      const hasPermission = userPermissions.some(permission => permission.name === requiredPermission);

      if (!hasPermission) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token', error });
    }
  };
};

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error });
  }
};

export { checkPermission, verifyToken };
