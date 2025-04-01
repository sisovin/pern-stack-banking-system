import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  description: varchar('description', { length: 255 }),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export type Role = InferModel<typeof roles>;
export type NewRole = InferModel<typeof roles, 'insert'>;
