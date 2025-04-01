import express from 'express';
import { getAccountStatement, getTransactionHistory, getCustomerReport } from '../controllers/reportingController';

const router = express.Router();

router.get('/account-statement/:accountId', getAccountStatement);
router.get('/transaction-history/:accountId', getTransactionHistory);
router.get('/customer-report/:customerId', getCustomerReport);

export default router;
