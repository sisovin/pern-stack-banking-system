import { Request, Response } from 'express';
import db from '../config/database';
import { transactions, NewTransaction } from '../models/Transaction';

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { type, status, amount, accountId } = req.body;
    const newTransaction: NewTransaction = {
      type,
      status,
      amount,
      accountId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = await db.insert(transactions).values(newTransaction).returning();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

export const getTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = await db.select().from(transactions).where({ id }).first();
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve transaction' });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, status, amount } = req.body;
    const updatedTransaction = {
      type,
      status,
      amount,
      updatedAt: Date.now(),
    };

    const result = await db.update(transactions).set(updatedTransaction).where({ id }).returning();
    if (!result) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.delete(transactions).where({ id }).returning();
    if (!result) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};
