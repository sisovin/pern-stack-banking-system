import express from 'express';
import { createAccount, getAccount, updateAccount, deleteAccount } from '../controllers/accountController';

const router = express.Router();

router.post('/accounts', createAccount);
router.get('/accounts/:id', getAccount);
router.put('/accounts/:id', updateAccount);
router.delete('/accounts/:id', deleteAccount);

export default router;
