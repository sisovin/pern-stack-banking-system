import express from 'express';
import { createTransaction, getTransaction, updateTransaction, deleteTransaction } from '../controllers/transactionController';

const router = express.Router();

router.post('/transactions', createTransaction);
router.get('/transactions/:id', getTransaction);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);

export default router;
