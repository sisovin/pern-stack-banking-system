import { Request, Response } from 'express';
import transactionService from '../services/transactionService';

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { type, status, amount, accountId } = req.body;
    const result = await transactionService.createTransaction(type, status, amount, accountId);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

export const getTransaction = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const transaction = await transactionService.getTransactionById(id);
    res.status(200).json(transaction);
  } catch (error: any) {
    if (error.message === 'Transaction not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to retrieve transaction' });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { type, status, amount } = req.body;
    const result = await transactionService.updateTransaction(id, { type, status, amount });
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Transaction not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await transactionService.deleteTransaction(id);
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Transaction not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

export const authorizeTransaction = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await transactionService.authorizeTransaction(id);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Transaction not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Transaction is not in a pending state') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to authorize transaction' });
  }
};

export const rejectTransaction = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await transactionService.rejectTransaction(id);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Transaction not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Transaction is not in a pending state') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to reject transaction' });
  }
};

export const getTransactionStats = async (req: Request, res: Response) => {
  try {
    const accountId = parseInt(req.params.accountId);
    const stats = await transactionService.getTransactionStats(accountId);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve transaction statistics' });
  }
};