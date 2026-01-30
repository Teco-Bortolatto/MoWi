/**
 * Tipos fundamentais do sistema MoWi
 * Alinhados com o schema do Supabase
 */

export type TransactionType = 'INCOME' | 'EXPENSE';

export type TransactionStatus = 'PENDING' | 'COMPLETED';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string | null;
  categoryId: string | null;
  date: Date;
  accountId: string | null;
  memberId: string | null;
  installmentNumber: number | null;
  totalInstallments: number;
  parentTransactionId: string | null;
  isRecurring: boolean;
  recurringTransactionId: string | null;
  status: TransactionStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | null;
  category: string | null;
  memberId: string | null;
  imageUrl: string | null;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD';

export type CreditCardTheme = 'black' | 'lime' | 'white';

export interface Account {
  id: string;
  userId: string;
  type: AccountType;
  name: string;
  bank: string;
  lastDigits: string | null;
  holderId: string;
  balance: number;
  creditLimit: number | null;
  currentBill: number;
  dueDay: number | null;
  closingDay: number | null;
  theme: CreditCardTheme | null;
  logoUrl: string | null;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Para compatibilidade com componentes que esperam CreditCard e BankAccount separadamente
export type CreditCard = Account;
export type BankAccount = Account;

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  role: string;
  email: string | null;
  avatarUrl: string | null;
  monthlyIncome: number;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tipos auxiliares para filtros e estados
 */
export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export type TransactionTypeFilter = 'all' | 'INCOME' | 'EXPENSE';

export interface FinanceFilters {
  selectedMember: string | null;
  dateRange: DateRange;
  transactionType: TransactionTypeFilter;
  searchText: string;
}

/**
 * Tipos para cálculos e agregações
 */
export interface CategoryExpense {
  category: string;
  amount: number;
  percentage: number;
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
}
