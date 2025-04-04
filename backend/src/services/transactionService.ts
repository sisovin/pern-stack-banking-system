import db from '../config/database';
import { transactions, Transaction, NewTransaction } from '../models/Transaction';
import { eq } from 'drizzle-orm';
import accountService from './accountService';
import ledgerService from './ledgerService';

class TransactionService {
  /**
   * Create a new transaction
   * @param type Transaction type
   * @param status Initial status (typically 'pending')
   * @param amount Transaction amount
   * @param accountId Associated account ID
   * @returns The created transaction
   */
  async createTransaction(
    type: string,
    status: string,
    amount: number,
    accountId: number
  ): Promise<Transaction> {
    const newTransaction: NewTransaction = {
      type,
      status,
      amount,
      accountId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = await db.insert(transactions).values(newTransaction).returning();
    return result[0];
  }

  /**
   * Get transaction by ID
   * @param id Transaction ID
   * @returns Transaction if found
   */
  async getTransactionById(id: number): Promise<Transaction> {
    const transaction = await db.select().from(transactions).where(eq(transactions.id, id)).single();
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    return transaction;
  }

  /**
   * Get all transactions for an account
   * @param accountId Account ID
   * @returns Array of transactions
   */
  async getTransactionsByAccount(accountId: number): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.accountId, accountId));
  }

  /**
   * Update transaction details
   * @param id Transaction ID
   * @param data Fields to update
   * @returns Updated transaction
   */
  async updateTransaction(
    id: number,
    data: Partial<Omit<Transaction, 'id' | 'createdAt'>>
  ): Promise<Transaction> {
    const updatedData = {
      ...data,
      updatedAt: Date.now(),
    };

    const result = await db
      .update(transactions)
      .set(updatedData)
      .where(eq(transactions.id, id))
      .returning();
    
    if (!result[0]) {
      throw new Error('Transaction not found');
    }
    
    return result[0];
  }

  /**
   * Delete a transaction
   * @param id Transaction ID
   * @returns The deleted transaction
   */
  async deleteTransaction(id: number): Promise<Transaction> {
    const result = await db
      .delete(transactions)
      .where(eq(transactions.id, id))
      .returning();
    
    if (!result[0]) {
      throw new Error('Transaction not found');
    }
    
    return result[0];
  }

  /**
   * Authorize a pending transaction and update account balance
   * @param id Transaction ID
   * @returns The authorized transaction
   */
  async authorizeTransaction(id: number): Promise<Transaction> {
    const transaction = await this.getTransactionById(id);
    
    if (transaction.status !== 'pending') {
      throw new Error('Transaction is not in a pending state');
    }

    // Apply transaction to account balance - this is simplified logic
    // In a real system, you'd handle different transaction types differently
    if (transaction.type === 'deposit') {
      await accountService.updateBalance(transaction.accountId, transaction.amount);
      
      // Record in ledger
      await ledgerService.postToLedger(
        transaction.accountId,
        transaction.amount, // debit
        0, // credit
        `Deposit transaction #${transaction.id}`
      );
    } else if (transaction.type === 'withdrawal') {
      await accountService.updateBalance(transaction.accountId, -transaction.amount);
      
      // Record in ledger
      await ledgerService.postToLedger(
        transaction.accountId,
        0, // debit
        transaction.amount, // credit
        `Withdrawal transaction #${transaction.id}`
      );
    }

    // Update transaction status
    return await this.updateTransaction(id, { status: 'authorized' });
  }

  /**
   * Reject a pending transaction
   * @param id Transaction ID
   * @returns The rejected transaction
   */
  async rejectTransaction(id: number): Promise<Transaction> {
    const transaction = await this.getTransactionById(id);
    
    if (transaction.status !== 'pending') {
      throw new Error('Transaction is not in a pending state');
    }
    
    return await this.updateTransaction(id, { status: 'rejected' });
  }

  /**
   * Get transaction statistics for an account
   * @param accountId Account ID
   * @returns Summary statistics
   */
  async getTransactionStats(accountId: number): Promise<any> {
    const allTransactions = await this.getTransactionsByAccount(accountId);
    
    const totalDeposits = allTransactions
      .filter(t => t.type === 'deposit' && t.status === 'authorized')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalWithdrawals = allTransactions
      .filter(t => t.type === 'withdrawal' && t.status === 'authorized')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalTransactions: allTransactions.length,
      totalDeposits,
      totalWithdrawals,
      netAmount: totalDeposits - totalWithdrawals
    };
  }
}

export default new TransactionService();