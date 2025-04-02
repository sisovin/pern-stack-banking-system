import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';

export const journalEntries = pgTable('journal_entries', {
  id: serial('id').primaryKey(),
  accountId: integer('account_id').notNull(),
  debit: integer('debit').notNull(),
  credit: integer('credit').notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export type JournalEntry = InferModel<typeof journalEntries>;
export type NewJournalEntry = InferModel<typeof journalEntries, 'insert'>;
