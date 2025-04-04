import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../config/database';
import { users } from '../models/User';
import { roles } from '../models/Role';
import { permissions } from '../models/Permission';
import { eq, inArray } from 'drizzle-orm';

/**
 * Middleware to check if a user has a specific role
 * @param requiredRoles Array of role names that are allowed to access the resource
 * @returns Middleware function
 */
export const hasRole = (requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
      const userId = decodedToken.userId;

      // Get user with roles
      const user = await db.select().from(users).where(eq(users.id, userId)).single();

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Get user's roles
      const userRoles = await db
        .select()
        .from(roles)
        .where(inArray(roles.id, user.roleIds));

      // Check if user has any of the required roles
      const hasRequiredRole = userRoles.some(role => 
        requiredRoles.includes(role.name)
      );

      if (!hasRequiredRole) {
        return res.status(403).json({ 
          message: 'Access denied: Required role not found',
          requiredRoles
        });
      }

      // Add user and roles to request for potential later use
      req.user = {
        ...decodedToken,
        roles: userRoles.map(role => role.name)
      };

      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token', error });
    }
  };
};

/**
 * Middleware to check if a user has a specific permission
 * @param requiredPermissions Array of permission names that are allowed to access the resource
 * @returns Middleware function
 */
export const hasPermission = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
      const userId = decodedToken.userId;

      // Get user with roles
      const user = await db.select().from(users).where(eq(users.id, userId)).single();

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Get user's roles
      const userRoles = await db
        .select()
        .from(roles)
        .where(inArray(roles.id, user.roleIds));

      // Collect all role IDs to fetch permissions
      const roleIds = userRoles.map(role => role.id);

      // Get all permissions for the user's roles
      const permissionRows = await db.execute(
        sql`
          SELECT p.* FROM permissions p
          JOIN role_permissions rp ON p.id = rp.permission_id
          WHERE rp.role_id IN (${roleIds.join(',')})
        `
      );

      const userPermissions = permissionRows.rows as Permission[];

      // Check if user has any of the required permissions
      const hasRequiredPermission = userPermissions.some(permission => 
        requiredPermissions.includes(permission.name)
      );

      if (!hasRequiredPermission) {
        return res.status(403).json({ 
          message: 'Access denied: Required permission not found',
          requiredPermissions
        });
      }

      // Add user, roles and permissions to request for potential later use
      req.user = {
        ...decodedToken,
        roles: userRoles.map(role => role.name),
        permissions: userPermissions.map(permission => permission.name)
      };

      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token', error });
    }
  };
};

/**
 * Verify user's identity and attach basic user information to the request
 * without checking roles or permissions
 */
export const identifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decodedToken.userId;

    // Get user
    const user = await db.select().from(users).where(eq(users.id, userId)).single();

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user information to request
    req.user = {
      ...decodedToken,
      username: user.username,
      email: user.email
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error });
  }
};

// Custom SQL helper for the permisions query
const sql = (strings: TemplateStringsArray, ...values: any[]) => {
  let str = strings[0];
  for (let i = 0; i < values.length; i++) {
    str += values[i] + strings[i + 1];
  }
  return { text: str };
};

// Add types to Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username?: string;
        email?: string;
        roles?: string[];
        permissions?: string[];
        [key: string]: any;
      };
    }
  }
}