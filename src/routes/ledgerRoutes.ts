import express from 'express';
import { postToLedger } from '../controllers/ledgerController';
import { checkPermission } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/ledger', checkPermission('post_to_ledger'), postToLedger);

export default router;
