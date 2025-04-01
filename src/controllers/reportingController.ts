import { Request, Response } from 'express';
import db from '../config/database';
import { accounts } from '../models/Account';
import { transactions } from '../models/Transaction';

export const getAccountStatement = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    const account = await db.select().from(accounts).where({ id: accountId }).first();
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const accountTransactions = await db.select().from(transactions).where({ accountId });
    res.status(200).json({ account, transactions: accountTransactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve account statement' });
  }
};

export const getTransactionHistory = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    const accountTransactions = await db.select().from(transactions).where({ accountId });
    res.status(200).json(accountTransactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve transaction history' });
  }
};

export const getCustomerReport = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const customerAccounts = await db.select().from(accounts).where({ customerId });
    const customerTransactions = await db.select().from(transactions).whereIn('accountId', customerAccounts.map(account => account.id));
    res.status(200).json({ accounts: customerAccounts, transactions: customerTransactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve customer report' });
  }
};
