import { Request, Response } from 'express';
import db from '../config/database';
import { accounts, NewAccount } from '../models/Account';

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { type, status, balance } = req.body;
    const newAccount: NewAccount = {
      type,
      status,
      balance,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = await db.insert(accounts).values(newAccount).returning();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create account' });
  }
};

export const getAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const account = await db.select().from(accounts).where({ id }).first();
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve account' });
  }
};

export const updateAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, status, balance } = req.body;
    const updatedAccount = {
      type,
      status,
      balance,
      updatedAt: Date.now(),
    };

    const result = await db.update(accounts).set(updatedAccount).where({ id }).returning();
    if (!result) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update account' });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.delete(accounts).where({ id }).returning();
    if (!result) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

export const trackAccountStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const account = await db.select().from(accounts).where({ id }).first();
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(200).json({ status: account.status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track account status' });
  }
};
