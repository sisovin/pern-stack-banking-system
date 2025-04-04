import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';

export const files = pgTable('files', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  size: integer('size').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export type File = InferModel<typeof files>;
export type NewFile = InferModel<typeof files, 'insert'>;
