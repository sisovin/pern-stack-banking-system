import express from 'express';
import { createTransaction, getTransaction, updateTransaction, deleteTransaction, authorizeTransaction, rejectTransaction } from '../controllers/transactionController';

const router = express.Router();

router.post('/transactions', createTransaction);
router.get('/transactions/:id', getTransaction);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);
router.post('/transactions/:id/authorize', authorizeTransaction);
router.post('/transactions/:id/reject', rejectTransaction);

export default router;
