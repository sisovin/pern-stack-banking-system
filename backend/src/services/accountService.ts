import db from '../config/database';
import { accounts, Account, NewAccount } from '../models/Account';
import { eq } from 'drizzle-orm';

class AccountService {
  /**
   * Create a new account
   * @param type Account type
   * @param status Account status
   * @param balance Initial balance
   * @returns The newly created account
   */
  async createAccount(type: string, status: string, balance: number): Promise<Account> {
    const newAccount: NewAccount = {
      type,
      status,
      balance,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = await db.insert(accounts).values(newAccount).returning();
    return result[0];
  }

  /**
   * Get account by ID
   * @param id Account ID
   * @returns Account if found
   */
  async getAccountById(id: number): Promise<Account> {
    const account = await db.select().from(accounts).where(eq(accounts.id, id)).single();
    
    if (!account) {
      throw new Error('Account not found');
    }
    
    return account;
  }

  /**
   * Update account details
   * @param id Account ID
   * @param data Fields to update
   * @returns Updated account
   */
  async updateAccount(id: number, data: Partial<Omit<Account, 'id' | 'createdAt'>>): Promise<Account> {
    const updatedData = {
      ...data,
      updatedAt: Date.now(),
    };

    const result = await db
      .update(accounts)
      .set(updatedData)
      .where(eq(accounts.id, id))
      .returning();
    
    if (!result[0]) {
      throw new Error('Account not found');
    }
    
    return result[0];
  }

  /**
   * Delete an account
   * @param id Account ID
   * @returns The deleted account
   */
  async deleteAccount(id: number): Promise<Account> {
    const result = await db
      .delete(accounts)
      .where(eq(accounts.id, id))
      .returning();
    
    if (!result[0]) {
      throw new Error('Account not found');
    }
    
    return result[0];
  }

  /**
   * Get account status
   * @param id Account ID
   * @returns Account status
   */
  async getAccountStatus(id: number): Promise<string> {
    const account = await this.getAccountById(id);
    return account.status;
  }

  /**
   * Update account balance
   * @param id Account ID
   * @param amount Amount to add (positive) or subtract (negative)
   * @returns Updated account
   */
  async updateBalance(id: number, amount: number): Promise<Account> {
    const account = await this.getAccountById(id);
    
    return await this.updateAccount(id, {
      balance: account.balance + amount
    });
  }
}

export default new AccountService();