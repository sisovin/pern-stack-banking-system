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

export const getLedgerEntries = async (req: Request, res: Response) => {
  try {
    const entries = await db.select().from(journalEntries);
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve ledger entries' });
  }
};

export const getLedgerEntryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const entry = await db.select().from(journalEntries).where({ id }).first();
    if (!entry) {
      return res.status(404).json({ error: 'Ledger entry not found' });
    }
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve ledger entry' });
  }
};

export const updateLedgerEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { accountId, debit, credit, description } = req.body;
    const updatedEntry = {
      accountId,
      debit,
      credit,
      description,
      updatedAt: Date.now(),
    };

    const result = await db.update(journalEntries).set(updatedEntry).where({ id }).returning();
    if (!result) {
      return res.status(404).json({ error: 'Ledger entry not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ledger entry' });
  }
};

export const deleteLedgerEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.delete(journalEntries).where({ id }).returning();
    if (!result) {
      return res.status(404).json({ error: 'Ledger entry not found' });
    }
    res.status(200).json({ message: 'Ledger entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ledger entry' });
  }
};
