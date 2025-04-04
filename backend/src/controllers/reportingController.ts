import { Request, Response } from 'express';
import reportingService from '../services/reportingService';

export const getAccountStatement = async (req: Request, res: Response) => {
  try {
    const accountId = parseInt(req.params.accountId);
    const statement = await reportingService.getAccountStatement(accountId);
    res.status(200).json(statement);
  } catch (error: any) {
    if (error.message === 'Account not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to retrieve account statement' });
  }
};

export const getTransactionHistory = async (req: Request, res: Response) => {
  try {
    const accountId = parseInt(req.params.accountId);
    const transactions = await reportingService.getTransactionHistory(accountId);
    res.status(200).json(transactions);
  } catch (error: any) {
    if (error.message === 'Account not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to retrieve transaction history' });
  }
};

export const getCustomerReport = async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.customerId);
    const report = await reportingService.getCustomerReport(customerId);
    res.status(200).json(report);
  } catch (error: any) {
    if (error.message === 'Customer not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to retrieve customer report' });
  }
};

export const generateFinancialStatements = async (req: Request, res: Response) => {
  try {
    const startDate = parseInt(req.query.startDate as string);
    const endDate = parseInt(req.query.endDate as string);
    
    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ error: 'Invalid date range provided' });
    }

    const statements = await reportingService.generateFinancialStatements({ startDate, endDate });
    res.status(200).json(statements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate financial statements' });
  }
};

export const generateReports = async (req: Request, res: Response) => {
  try {
    const reportType = req.query.reportType as string;
    const startDate = parseInt(req.query.startDate as string);
    const endDate = parseInt(req.query.endDate as string);
    
    if (!reportType || isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ error: 'Invalid parameters provided' });
    }

    const reports = await reportingService.generateReports(reportType, { startDate, endDate });
    res.status(200).json(reports);
  } catch (error: any) {
    if (error.message?.includes('Unknown report type')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to generate reports' });
  }
};