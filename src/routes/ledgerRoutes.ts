import express from 'express';
import { postToLedger, getLedgerEntries, getLedgerEntryById, updateLedgerEntry, deleteLedgerEntry } from '../controllers/ledgerController';
import { checkPermission } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/ledger', checkPermission('post_to_ledger'), postToLedger);
router.get('/ledger', checkPermission('view_ledger'), getLedgerEntries);
router.get('/ledger/:id', checkPermission('view_ledger'), getLedgerEntryById);
router.put('/ledger/:id', checkPermission('update_ledger'), updateLedgerEntry);
router.delete('/ledger/:id', checkPermission('delete_ledger'), deleteLedgerEntry);

export default router;
