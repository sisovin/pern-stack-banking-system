import { Request, Response } from 'express';
import ledgerService from '../services/ledgerService';

export const postToLedger = async (req: Request, res: Response) => {
  const { accountId, debit, credit, description } = req.body;

  if (!accountId || !debit || !credit || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await ledgerService.postToLedger(accountId, debit, credit, description);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to post to ledger' });
  }
};

export const getLedgerEntries = async (req: Request, res: Response) => {
  try {
    const entries = await ledgerService.getLedgerEntries();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve ledger entries' });
  }
};

export const getLedgerEntryById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const entry = await ledgerService.getLedgerEntryById(id);
    res.status(200).json(entry);
  } catch (error: any) {
    if (error.message === 'Ledger entry not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to retrieve ledger entry' });
  }
};

export const updateLedgerEntry = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { accountId, debit, credit, description } = req.body;
    
    const result = await ledgerService.updateLedgerEntry(id, {
      accountId,
      debit,
      credit,
      description
    });
    
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Ledger entry not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update ledger entry' });
  }
};

export const deleteLedgerEntry = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await ledgerService.deleteLedgerEntry(id);
    res.status(200).json({ message: 'Ledger entry deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Ledger entry not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to delete ledger entry' });
  }
};

export const getAccountBalance = async (req: Request, res: Response) => {
  try {
    const accountId = parseInt(req.params.accountId);
    const balance = await ledgerService.calculateAccountBalance(accountId);
    res.status(200).json({ accountId, balance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate account balance' });
  }
};