import { Request, Response } from 'express';
import db from '../config/database';
import { journalEntries } from '../models/JournalEntry';

export const postToLedger = async (req: Request, res: Response) => {
  const { accountId, debit, credit, description } = req.body;

  if (!accountId || !debit || !credit || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newEntry = await db.insert(journalEntries).values({
      accountId,
      debit,
      credit,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return res.status(201).json(newEntry);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to post to ledger' });
  }
};
