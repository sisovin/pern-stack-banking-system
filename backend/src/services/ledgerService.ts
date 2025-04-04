import db from '../config/database';
import { journalEntries, JournalEntry, NewJournalEntry } from '../models/JournalEntry';
import { eq } from 'drizzle-orm';

class LedgerService {
  /**
   * Create a new journal entry
   * @param accountId Account ID for the entry
   * @param debit Debit amount
   * @param credit Credit amount
   * @param description Description of the transaction
   * @returns The newly created journal entry
   */
  async postToLedger(
    accountId: number,
    debit: number,
    credit: number,
    description: string
  ): Promise<JournalEntry> {
    const newEntry: NewJournalEntry = {
      accountId,
      debit,
      credit,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = await db.insert(journalEntries).values(newEntry).returning();
    return result[0];
  }

  /**
   * Get all journal entries
   * @returns Array of all journal entries
   */
  async getLedgerEntries(): Promise<JournalEntry[]> {
    return await db.select().from(journalEntries);
  }

  /**
   * Get journal entry by ID
   * @param id Entry ID
   * @returns Journal entry if found
   */
  async getLedgerEntryById(id: number): Promise<JournalEntry> {
    const entry = await db.select().from(journalEntries).where(eq(journalEntries.id, id)).single();
    
    if (!entry) {
      throw new Error('Ledger entry not found');
    }
    
    return entry;
  }

  /**
   * Update journal entry
   * @param id Entry ID
   * @param data Fields to update
   * @returns Updated journal entry
   */
  async updateLedgerEntry(
    id: number,
    data: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>
  ): Promise<JournalEntry> {
    const updatedData = {
      ...data,
      updatedAt: Date.now(),
    };

    const result = await db
      .update(journalEntries)
      .set(updatedData)
      .where(eq(journalEntries.id, id))
      .returning();
    
    if (!result[0]) {
      throw new Error('Ledger entry not found');
    }
    
    return result[0];
  }

  /**
   * Delete a journal entry
   * @param id Entry ID
   * @returns The deleted journal entry
   */
  async deleteLedgerEntry(id: number): Promise<JournalEntry> {
    const result = await db
      .delete(journalEntries)
      .where(eq(journalEntries.id, id))
      .returning();
    
    if (!result[0]) {
      throw new Error('Ledger entry not found');
    }
    
    return result[0];
  }

  /**
   * Get all entries for a specific account
   * @param accountId Account ID
   * @returns Array of journal entries for the account
   */
  async getEntriesByAccount(accountId: number): Promise<JournalEntry[]> {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.accountId, accountId));
  }

  /**
   * Calculate account balance from journal entries
   * @param accountId Account ID
   * @returns Current balance
   */
  async calculateAccountBalance(accountId: number): Promise<number> {
    const entries = await this.getEntriesByAccount(accountId);
    
    return entries.reduce((balance, entry) => {
      return balance + entry.debit - entry.credit;
    }, 0);
  }
}

export default new LedgerService();