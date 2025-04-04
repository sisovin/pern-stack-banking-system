import { Request, Response } from 'express';
import accountService from '../services/accountService';

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { type, status, balance } = req.body;
    const result = await accountService.createAccount(type, status, balance);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create account' });
  }
};

export const getAccount = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const account = await accountService.getAccountById(id);
    res.status(200).json(account);
  } catch (error: any) {
    if (error.message === 'Account not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to retrieve account' });
  }
};

export const updateAccount = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { type, status, balance } = req.body;
    const result = await accountService.updateAccount(id, { type, status, balance });
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Account not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update account' });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await accountService.deleteAccount(id);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Account not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

export const trackAccountStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const status = await accountService.getAccountStatus(id);
    res.status(200).json({ status });
  } catch (error: any) {
    if (error.message === 'Account not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to track account status' });
  }
};