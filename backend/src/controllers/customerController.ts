import { Request, Response } from 'express';
import customerService from '../services/customerService';

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const customerData = req.body;
    const result = await customerService.createCustomer(customerData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const customer = await customerService.getCustomerById(id);
    res.status(200).json(customer);
  } catch (error: any) {
    if (error.message === 'Customer not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to retrieve customer' });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const customerData = req.body;
    const result = await customerService.updateCustomer(id, customerData);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Customer not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await customerService.deleteCustomer(id);
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Customer not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};

export const verifyCustomer = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const customer = await customerService.verifyCustomer(id);
    res.status(200).json(customer);
  } catch (error: any) {
    if (error.message === 'Customer not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to verify customer' });
  }
};

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const allCustomers = await customerService.getAllCustomers();
    res.status(200).json(allCustomers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve customers' });
  }
};