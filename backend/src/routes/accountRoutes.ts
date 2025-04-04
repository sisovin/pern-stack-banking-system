import express from 'express';
import { createAccount, getAccount, updateAccount, deleteAccount, trackAccountStatus } from '../controllers/accountController';
import { hasRole, hasPermission, identifyUser } from '../middleware/roleMiddleware';

const router = express.Router();

// Route only accessible to admins
router.get('/admin-only', 
  hasRole(['admin']), 
  (req: express.Request, res: express.Response) => {
      res.json({ message: 'Admin access granted', user: req.user });
  }
);

// Route to create a new account
router.post('/accounts', hasRole('admin'), createAccount);
router.get('/accounts/:id', identifyUser, getAccount);
router.put('/accounts/:id', hasPermission('edit_account'), updateAccount);
router.delete('/accounts/:id', hasRole('admin'), deleteAccount);
router.get('/accounts/:id/status', trackAccountStatus);
router.patch('/accounts/:id', hasPermission('edit_account'), updateAccount);

// Just identify the user without checking permissions
router.get('/profile', 
  identifyUser, 
  (req: express.Request, res: express.Response) => {
    res.json({ 
      message: 'User profile accessed',
      user: {
        userId: req.user!.userId,
        username: req.user!.username,
        email: req.user!.email
      }
    });
  }
);

export default router;
