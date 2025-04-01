import { Request, Response } from 'express';
import db from '../config/database';
import { customers, NewCustomer } from '../models/Customer';

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const newCustomer: NewCustomer = req.body;
    const result = await db.insert(customers).values(newCustomer).returning();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await db.select().from(customers).where(customers.id.eq(id)).single();
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve customer' });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCustomer: Partial<NewCustomer> = req.body;
    const result = await db.update(customers).set(updatedCustomer).where(customers.id.eq(id)).returning();
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.delete(customers).where(customers.id.eq(id)).returning();
    if (result.length > 0) {
      res.status(200).json({ message: 'Customer deleted successfully' });
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};

export const verifyCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCustomer = await db.update(customers).set({ kycStatus: 'verified' }).where(customers.id.eq(id)).returning();
    if (updatedCustomer.length > 0) {
      res.status(200).json(updatedCustomer[0]);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify customer' });
  }
};

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const allCustomers = await db.select().from(customers);
    res.status(200).json(allCustomers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve customers' });
  }
};
