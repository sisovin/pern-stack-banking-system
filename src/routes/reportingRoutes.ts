import express from 'express';
import { getAccountStatement, getTransactionHistory, getCustomerReport, generateFinancialStatements, generateReports } from '../controllers/reportingController';

const router = express.Router();

router.get('/account-statement/:accountId', getAccountStatement);
router.get('/transaction-history/:accountId', getTransactionHistory);
router.get('/customer-report/:customerId', getCustomerReport);
router.get('/financial-statements', generateFinancialStatements);
router.get('/reports', generateReports);

export default router;
