import { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react'
import {
  Transaction,
  Goal,
  Account,
  FamilyMember,
  FinanceFilters,
  DateRange,
  TransactionTypeFilter,
  CategoryExpense,
  FinancialSummary,
} from '../types'
import { transactionService } from '../services/transactionService'
import { accountService } from '../services/accountService'
import { familyMemberService } from '../services/familyMemberService'
import { goalService } from '../services/goalService'
import { useAuth } from '../hooks/useAuth'

interface FinanceContextType {
  // Estado das entidades
  transactions: Transaction[]
  goals: Goal[]
  accounts: Account[]
  familyMembers: FamilyMember[]
  loading: boolean

  // Filtros
  filters: FinanceFilters
  setSelectedMember: (memberId: string | null) => void
  setDateRange: (dateRange: DateRange) => void
  setTransactionType: (type: TransactionTypeFilter) => void
  setSearchText: (text: string) => void
  resetFilters: () => void

  // CRUD Transactions
  addTransaction: (transaction: any) => Promise<void>
  updateTransaction: (id: string, updates: any) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>

  // CRUD Goals
  addGoal: (goal: any) => Promise<void>
  updateGoal: (id: string, updates: any) => Promise<void>
  deleteGoal: (id: string) => Promise<void>

  // CRUD Accounts
  addAccount: (account: any) => Promise<void>
  updateAccount: (id: string, updates: any) => Promise<void>
  deleteAccount: (id: string) => Promise<void>

  // CRUD FamilyMembers
  addFamilyMember: (member: any) => Promise<void>
  updateFamilyMember: (id: string, updates: any) => Promise<void>
  deleteFamilyMember: (id: string) => Promise<void>

  // Funções de cálculo
  getFilteredTransactions: () => Transaction[]
  calculateTotalBalance: () => number
  calculateIncomeForPeriod: (startDate?: Date, endDate?: Date) => number
  calculateExpensesForPeriod: (startDate?: Date, endDate?: Date) => number
  calculateExpensesByCategory: (startDate?: Date, endDate?: Date) => CategoryExpense[]
  calculateCategoryPercentage: (category: string, startDate?: Date, endDate?: Date) => number
  calculateSavingsRate: (startDate?: Date, endDate?: Date) => number
  getFinancialSummary: (startDate?: Date, endDate?: Date) => FinancialSummary
  refreshData: () => Promise<void>
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

interface FinanceProviderProps {
  children: ReactNode
}

export function FinanceProvider({ children }: FinanceProviderProps) {
  const { user } = useAuth()
  
  // Estado das entidades
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [loading, setLoading] = useState(true)

  // Estado dos filtros
  const [filters, setFilters] = useState<FinanceFilters>({
    selectedMember: null,
    dateRange: { startDate: null, endDate: null },
    transactionType: 'all',
    searchText: '',
  })

  // Carregar dados iniciais
  const refreshData = useCallback(async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const [tData, gData, aData, fData] = await Promise.all([
        transactionService.getAll(),
        goalService.getAll(),
        accountService.getAll(),
        familyMemberService.getAll(),
      ])
      
      setTransactions(tData)
      setGoals(gData)
      setAccounts(aData)
      setFamilyMembers(fData)

      // Lógica de recorrência simplificada:
      // Se houver transações recorrentes marcadas, poderíamos gerar as do mês atual aqui
      // Para este MVP, vamos focar em garantir que o sistema aceite a flag isRecurring
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  // Funções de filtro
  const setSelectedMember = useCallback((memberId: string | null) => {
    setFilters((prev) => ({ ...prev, selectedMember: memberId }))
  }, [])

  const setDateRange = useCallback((dateRange: DateRange) => {
    setFilters((prev) => ({ ...prev, dateRange }))
  }, [])

  const setTransactionType = useCallback((type: TransactionTypeFilter) => {
    setFilters((prev) => ({ ...prev, transactionType: type }))
  }, [])

  const setSearchText = useCallback((text: string) => {
    setFilters((prev) => ({ ...prev, searchText: text }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      selectedMember: null,
      dateRange: { startDate: null, endDate: null },
      transactionType: 'all',
      searchText: '',
    })
  }, [])

  // CRUD Transactions
  const addTransaction = async (transactionData: any) => {
    await transactionService.create(transactionData)
    await refreshData()
  }

  const updateTransaction = async (id: string, updates: any) => {
    await transactionService.update(id, updates)
    await refreshData()
  }

  const deleteTransaction = async (id: string) => {
    await transactionService.delete(id)
    await refreshData()
  }

  // CRUD Goals
  const addGoal = async (goalData: any) => {
    await goalService.create(goalData)
    await refreshData()
  }

  const updateGoal = async (id: string, updates: any) => {
    await goalService.update(id, updates)
    await refreshData()
  }

  const deleteGoal = async (id: string) => {
    await goalService.delete(id)
    await refreshData()
  }

  // CRUD Accounts
  const addAccount = async (accountData: any) => {
    await accountService.create(accountData)
    await refreshData()
  }

  const updateAccount = async (id: string, updates: any) => {
    await accountService.update(id, updates)
    await refreshData()
  }

  const deleteAccount = async (id: string) => {
    await accountService.delete(id)
    await refreshData()
  }

  // CRUD FamilyMembers
  const addFamilyMember = async (memberData: any) => {
    await familyMemberService.create(memberData)
    await refreshData()
  }

  const updateFamilyMember = async (id: string, updates: any) => {
    await familyMemberService.update(id, updates)
    await refreshData()
  }

  const deleteFamilyMember = async (id: string) => {
    await familyMemberService.delete(id)
    await refreshData()
  }

  // Funções de cálculo
  const getFilteredTransactions = useCallback((): Transaction[] => {
    let filtered = [...transactions]

    // Filtro por membro
    if (filters.selectedMember) {
      filtered = filtered.filter((t) => t.memberId === filters.selectedMember)
    }

    // Filtro por tipo
    if (filters.transactionType !== 'all') {
      filtered = filtered.filter((t) => t.type === filters.transactionType)
    }

    // Filtro por período
    if (filters.dateRange.startDate) {
      const start = new Date(filters.dateRange.startDate)
      start.setHours(0, 0, 0, 0)
      filtered = filtered.filter((t) => t.date >= start)
    }
    if (filters.dateRange.endDate) {
      const end = new Date(filters.dateRange.endDate)
      end.setHours(23, 59, 59, 999)
      filtered = filtered.filter((t) => t.date <= end)
    }

    // Filtro por texto de busca
    if (filters.searchText.trim()) {
      const searchLower = filters.searchText.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchLower)
      )
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [transactions, filters])

  const calculateTotalBalance = useCallback((): number => {
    const filteredTransactions = getFilteredTransactions()
    
    // Se não houver filtro de período, usamos o saldo atual das contas
    if (!filters.dateRange.startDate && !filters.dateRange.endDate && !filters.selectedMember) {
        return accounts.reduce((sum, acc) => {
            if (acc.type === 'CREDIT_CARD') {
                return sum + (acc.creditLimit || 0) - acc.currentBill
            }
            return sum + acc.balance
        }, 0)
    }

    // Se houver filtro, calculamos o saldo com base nas transações filtradas
    // Nota: Em um sistema real, precisaríamos do saldo inicial do período
    return filteredTransactions.reduce((sum, t) => {
        return t.type === 'INCOME' ? sum + t.amount : sum - t.amount
    }, 0)
  }, [accounts, getFilteredTransactions, filters])

  const calculateIncomeForPeriod = useCallback(
    (startDate?: Date, endDate?: Date): number => {
      let filtered = transactions.filter((t) => t.type === 'INCOME' && t.status === 'COMPLETED')

      // Aplicar filtro de membro se existir
      if (filters.selectedMember) {
        filtered = filtered.filter((t) => t.memberId === filters.selectedMember)
      }

      if (startDate) {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        filtered = filtered.filter((t) => t.date >= start)
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        filtered = filtered.filter((t) => t.date <= end)
      }

      return filtered.reduce((sum, t) => sum + t.amount, 0)
    },
    [transactions, filters.selectedMember]
  )

  const calculateExpensesForPeriod = useCallback(
    (startDate?: Date, endDate?: Date): number => {
      let filtered = transactions.filter((t) => t.type === 'EXPENSE' && t.status === 'COMPLETED')

      // Aplicar filtro de membro se existir
      if (filters.selectedMember) {
        filtered = filtered.filter((t) => t.memberId === filters.selectedMember)
      }

      if (startDate) {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        filtered = filtered.filter((t) => t.date >= start)
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        filtered = filtered.filter((t) => t.date <= end)
      }

      return filtered.reduce((sum, t) => sum + t.amount, 0)
    },
    [transactions, filters.selectedMember]
  )

  const calculateExpensesByCategory = useCallback(
    (startDate?: Date, endDate?: Date): CategoryExpense[] => {
      let filtered = transactions.filter((t) => t.type === 'EXPENSE' && t.status === 'COMPLETED')

      if (startDate) {
        filtered = filtered.filter((t) => t.date >= startDate)
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        filtered = filtered.filter((t) => t.date <= end)
      }

      const categoryMap = new Map<string, number>()
      filtered.forEach((t) => {
        const categoryName = t.category || 'Sem Categoria'
        const current = categoryMap.get(categoryName) || 0
        categoryMap.set(categoryName, current + t.amount)
      })

      const totalIncome = calculateIncomeForPeriod(startDate, endDate)
      const categoryExpenses: CategoryExpense[] = Array.from(categoryMap.entries()).map(
        ([category, amount]) => ({
          category,
          amount,
          percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0,
        })
      )

      return categoryExpenses.sort((a, b) => b.amount - a.amount)
    },
    [transactions, calculateIncomeForPeriod]
  )

  const calculateCategoryPercentage = useCallback(
    (category: string, startDate?: Date, endDate?: Date): number => {
      const expenses = calculateExpensesByCategory(startDate, endDate)
      const categoryExpense = expenses.find((e) => e.category === category)
      return categoryExpense?.percentage || 0
    },
    [calculateExpensesByCategory]
  )

  const calculateSavingsRate = useCallback(
    (startDate?: Date, endDate?: Date): number => {
      const income = calculateIncomeForPeriod(startDate, endDate)
      const expenses = calculateExpensesForPeriod(startDate, endDate)
      if (income === 0) return 0
      return ((income - expenses) / income) * 100
    },
    [calculateIncomeForPeriod, calculateExpensesForPeriod]
  )

  const getFinancialSummary = useCallback(
    (startDate?: Date, endDate?: Date): FinancialSummary => {
      const start = startDate || (filters.dateRange.startDate ? new Date(filters.dateRange.startDate) : undefined)
      const end = endDate || (filters.dateRange.endDate ? new Date(filters.dateRange.endDate) : undefined)
      
      const incomeValue = calculateIncomeForPeriod(start, end)
      const expensesValue = calculateExpensesForPeriod(start, end)
      const totalBalanceValue = calculateTotalBalance()
      const savingsRateValue = calculateSavingsRate(start, end)

      return {
        totalBalance: totalBalanceValue,
        totalIncome: incomeValue,
        totalExpenses: expensesValue,
        savingsRate: savingsRateValue,
      }
    },
    [calculateIncomeForPeriod, calculateExpensesForPeriod, calculateTotalBalance, calculateSavingsRate, filters.dateRange]
  )

  const value: FinanceContextType = {
    transactions,
    goals,
    accounts,
    familyMembers,
    loading,
    filters,
    setSelectedMember,
    setDateRange,
    setTransactionType,
    setSearchText,
    resetFilters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    addAccount,
    updateAccount,
    deleteAccount,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    getFilteredTransactions,
    calculateTotalBalance,
    calculateIncomeForPeriod,
    calculateExpensesForPeriod,
    calculateExpensesByCategory,
    calculateCategoryPercentage,
    calculateSavingsRate,
    getFinancialSummary,
    refreshData,
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
