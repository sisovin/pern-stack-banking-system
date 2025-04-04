import db from '../config/database';
import { customers, Customer, NewCustomer } from '../models/Customer';
import { eq } from 'drizzle-orm';

class CustomerService {
  /**
   * Create a new customer
   * @param customerData Customer information
   * @returns The newly created customer
   */
  async createCustomer(customerData: Omit<NewCustomer, 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const newCustomer: NewCustomer = {
      ...customerData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = await db.insert(customers).values(newCustomer).returning();
    return result[0];
  }

  /**
   * Get customer by ID
   * @param id Customer ID
   * @returns Customer if found
   */
  async getCustomerById(id: number): Promise<Customer> {
    const customer = await db.select().from(customers).where(eq(customers.id, id)).single();
    
    if (!customer) {
      throw new Error('Customer not found');
    }
    
    return customer;
  }

  /**
   * Get all customers
   * @returns Array of all customers
   */
  async getAllCustomers(): Promise<Customer[]> {
    return await db.select().from(customers);
  }

  /**
   * Update customer details
   * @param id Customer ID
   * @param data Fields to update
   * @returns Updated customer
   */
  async updateCustomer(id: number, data: Partial<Omit<Customer, 'id' | 'createdAt'>>): Promise<Customer> {
    const updatedData = {
      ...data,
      updatedAt: Date.now(),
    };

    const result = await db
      .update(customers)
      .set(updatedData)
      .where(eq(customers.id, id))
      .returning();
    
    if (!result[0]) {
      throw new Error('Customer not found');
    }
    
    return result[0];
  }

  /**
   * Delete a customer
   * @param id Customer ID
   * @returns The deleted customer
   */
  async deleteCustomer(id: number): Promise<Customer> {
    const result = await db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning();
    
    if (!result[0]) {
      throw new Error('Customer not found');
    }
    
    return result[0];
  }

  /**
   * Verify a customer (set KYC status to 'verified')
   * @param id Customer ID
   * @returns Updated customer
   */
  async verifyCustomer(id: number): Promise<Customer> {
    return await this.updateCustomer(id, { kycStatus: 'verified' });
  }

  /**
   * Find customers by email
   * @param email Customer email
   * @returns Customer if found
   */
  async findCustomerByEmail(email: string): Promise<Customer | undefined> {
    return await db
      .select()
      .from(customers)
      .where(eq(customers.email, email))
      .single();
  }

  /**
   * Check if customer is verified
   * @param id Customer ID
   * @returns Boolean indicating if customer is verified
   */
  async isCustomerVerified(id: number): Promise<boolean> {
    const customer = await this.getCustomerById(id);
    return customer.kycStatus === 'verified';
  }
}

export default new CustomerService();