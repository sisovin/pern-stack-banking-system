import { integer, pgTable, serial, varchar, text } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  address: text('address').notNull(),
  dateOfBirth: varchar('date_of_birth', { length: 10 }).notNull(),
  kycStatus: varchar('kyc_status', { length: 50 }).notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export type Customer = InferModel<typeof customers>;
export type NewCustomer = InferModel<typeof customers, 'insert'>;
