import express from 'express';
import { createCustomer, getCustomerById, updateCustomer, deleteCustomer } from '../controllers/customerController';

const router = express.Router();

router.post('/customers', createCustomer);
router.get('/customers/:id', getCustomerById);
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);

export default router;
