import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  amount: integer('amount').notNull(),
  accountId: integer('account_id').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export type Transaction = InferModel<typeof transactions>;
export type NewTransaction = InferModel<typeof transactions, 'insert'>;
