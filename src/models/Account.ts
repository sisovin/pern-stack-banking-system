import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';

export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  balance: integer('balance').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export type Account = InferModel<typeof accounts>;
export type NewAccount = InferModel<typeof accounts, 'insert'>;
