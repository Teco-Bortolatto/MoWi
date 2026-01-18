/**
 * Tipos fundamentais do sistema mycash+
 * Baseados nas 5 entidades principais: Transaction, Goal, CreditCard, BankAccount, FamilyMember
 */

export type TransactionType = 'income' | 'expense';

export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: Date;
  accountId: string | null; // ID da conta bancária ou cartão de crédito
  memberId: string | null; // ID do membro responsável, null = família geral
  installments: number; // Número de parcelas (1 = à vista)
  currentInstallment: number; // Parcela atual (1, 2, 3...)
  status: TransactionStatus;
  isRecurring: boolean; // Se é despesa recorrente (ex: assinatura mensal)
  isPaid: boolean; // Se foi paga (para despesas)
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | null; // null = sem prazo
  category: string;
  memberId: string | null; // ID do membro responsável, null = família geral
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreditCardTheme = 'black' | 'lime' | 'white';

export interface CreditCard {
  id: string;
  name: string; // Ex: "Nubank Mastercard"
  holderId: string; // ID do membro titular
  closingDay: number; // Dia de fechamento (1-31)
  dueDay: number; // Dia de vencimento (1-31)
  limit: number; // Limite total
  currentBill: number; // Fatura atual
  theme: CreditCardTheme;
  lastDigits: string | null; // Últimos 4 dígitos (opcional)
  createdAt: Date;
  updatedAt: Date;
}

export interface BankAccount {
  id: string;
  name: string; // Ex: "Nubank Conta"
  holderId: string; // ID do membro titular
  balance: number; // Saldo atual
  bankName: string | null; // Nome do banco (opcional)
  accountNumber: string | null; // Número da conta (opcional)
  createdAt: Date;
  updatedAt: Date;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: string; // Ex: "Pai", "Mãe", "Filho", "Avô"
  email: string | null;
  avatarUrl: string | null; // URL da imagem do avatar
  monthlyIncome: number; // Renda mensal estimada (opcional, pode ser 0)
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

export type TransactionTypeFilter = 'all' | 'income' | 'expense';

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
  percentage: number; // Percentual em relação à receita total
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number; // (receitas - despesas) / receitas × 100
}
