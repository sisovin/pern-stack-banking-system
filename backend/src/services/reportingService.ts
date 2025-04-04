import db from '../config/database';
import { accounts, Account } from '../models/Account';
import { transactions, Transaction } from '../models/Transaction';
import { customers } from '../models/Customer';
import { eq, and, between, sql } from 'drizzle-orm';
import { journalEntries } from '../models/JournalEntry';

interface AccountStatement {
  account: Account;
  transactions: Transaction[];
}

interface CustomerReport {
  accounts: Account[];
  transactions: Transaction[];
}

interface DateRange {
  startDate: number;
  endDate: number;
}

interface FinancialStatement {
  period: string;
  totalAssets: number;
  totalLiabilities: number;
  netIncome: number;
  totalTransactions: number;
}

class ReportingService {
  /**
   * Get account statement with all transactions
   * @param accountId Account ID
   * @returns Account and its transactions
   */
  async getAccountStatement(accountId: number): Promise<AccountStatement> {
    const account = await db.select().from(accounts).where(eq(accounts.id, accountId)).single();
    
    if (!account) {
      throw new Error('Account not found');
    }

    const accountTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.accountId, accountId));

    return {
      account,
      transactions: accountTransactions
    };
  }

  /**
   * Get transaction history for an account
   * @param accountId Account ID
   * @returns All transactions for the account
   */
  async getTransactionHistory(accountId: number): Promise<Transaction[]> {
    const account = await db.select().from(accounts).where(eq(accounts.id, accountId)).single();
    
    if (!account) {
      throw new Error('Account not found');
    }

    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.accountId, accountId))
      .orderBy(transactions.createdAt);
  }

  /**
   * Get customer report with all accounts and transactions
   * @param customerId Customer ID
   * @returns All accounts and transactions for the customer
   */
  async getCustomerReport(customerId: number): Promise<CustomerReport> {
    // First verify the customer exists
    const customer = await db.select().from(customers).where(eq(customers.id, customerId)).single();
    
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Get all accounts for the customer
    // Note: This assumes there's a customerId column in accounts - if not, you'll need to implement the relationship
    const customerAccounts = await db
      .select()
      .from(accounts)
      .where(eq(accounts.customerId as any, customerId));

    if (customerAccounts.length === 0) {
      return { accounts: [], transactions: [] };
    }

    // Get all transactions for all customer accounts
    const accountIds = customerAccounts.map(account => account.id);
    
    const customerTransactions = await db
      .select()
      .from(transactions)
      .where(sql`${transactions.accountId} IN ${accountIds}`);

    return {
      accounts: customerAccounts,
      transactions: customerTransactions
    };
  }

  /**
   * Generate financial statements for a date range
   * @param dateRange Start and end dates for the statement
   * @returns Financial statement data
   */
  async generateFinancialStatements(dateRange: DateRange): Promise<FinancialStatement> {
    const { startDate, endDate } = dateRange;

    // Get all transactions in the period
    const periodTransactions = await db
      .select()
      .from(transactions)
      .where(
        and(
          between(transactions.createdAt, startDate, endDate),
          eq(transactions.status, 'authorized')
        )
      );

    // Calculate totals
    const totalDeposits = periodTransactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalWithdrawals = periodTransactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0);

    // Get account balances (assets)
    const allAccounts = await db.select().from(accounts);
    const totalAssets = allAccounts.reduce((sum, account) => sum + account.balance, 0);

    // Generate the statement
    // Typically liabilities would be calculated from actual liability accounts
    // This is simplified for demonstration
    return {
      period: `${new Date(startDate).toISOString().split('T')[0]} to ${new Date(endDate).toISOString().split('T')[0]}`,
      totalAssets,
      totalLiabilities: 0, // Simplified
      netIncome: totalDeposits - totalWithdrawals,
      totalTransactions: periodTransactions.length
    };
  }

  /**
   * Generate custom reports based on type
   * @param reportType Type of report to generate
   * @param dateRange Start and end dates for the report
   * @returns Custom report data
   */
  async generateReports(reportType: string, dateRange: DateRange): Promise<any> {
    const { startDate, endDate } = dateRange;

    switch (reportType) {
      case 'transaction-volume': {
        const transactions = await db
          .select()
          .from(transactions)
          .where(between(transactions.createdAt, startDate, endDate));

        const depositCount = transactions.filter(t => t.type === 'deposit').length;
        const withdrawalCount = transactions.filter(t => t.type === 'withdrawal').length;

        return {
          reportType: 'Transaction Volume',
          period: `${new Date(startDate).toISOString().split('T')[0]} to ${new Date(endDate).toISOString().split('T')[0]}`,
          totalTransactions: transactions.length,
          depositCount,
          withdrawalCount,
          averageTransactionSize: transactions.length > 0 
            ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length 
            : 0
        };
      }

      case 'account-activity': {
        const allAccounts = await db.select().from(accounts);
        
        // Get transactions for each account in the period
        const accountActivity = await Promise.all(
          allAccounts.map(async (account) => {
            const accountTransactions = await db
              .select()
              .from(transactions)
              .where(
                and(
                  eq(transactions.accountId, account.id),
                  between(transactions.createdAt, startDate, endDate)
                )
              );

            return {
              accountId: account.id,
              accountType: account.type,
              transactionCount: accountTransactions.length,
              totalAmount: accountTransactions.reduce((sum, t) => sum + t.amount, 0)
            };
          })
        );

        return {
          reportType: 'Account Activity',
          period: `${new Date(startDate).toISOString().split('T')[0]} to ${new Date(endDate).toISOString().split('T')[0]}`,
          accounts: accountActivity,
        };
      }

      case 'ledger-summary': {
        const ledgerEntries = await db
          .select()
          .from(journalEntries)
          .where(between(journalEntries.createdAt, startDate, endDate));

        const totalDebits = ledgerEntries.reduce((sum, entry) => sum + entry.debit, 0);
        const totalCredits = ledgerEntries.reduce((sum, entry) => sum + entry.credit, 0);

        return {
          reportType: 'Ledger Summary',
          period: `${new Date(startDate).toISOString().split('T')[0]} to ${new Date(endDate).toISOString().split('T')[0]}`,
          totalEntries: ledgerEntries.length,
          totalDebits,
          totalCredits,
          netAmount: totalDebits - totalCredits
        };
      }

      default:
        throw new Error(`Unknown report type: ${reportType}`);
    }
  }
}

export default new ReportingService();