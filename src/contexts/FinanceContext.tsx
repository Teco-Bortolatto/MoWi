import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'
import type {
  Transaction,
  Goal,
  CreditCard,
  BankAccount,
  FamilyMember,
  FinanceFilters,
  DateRange,
  TransactionTypeFilter,
  CategoryExpense,
  FinancialSummary,
} from '../types'

interface FinanceContextType {
  // Estado das entidades
  transactions: Transaction[]
  goals: Goal[]
  creditCards: CreditCard[]
  bankAccounts: BankAccount[]
  familyMembers: FamilyMember[]

  // Filtros
  filters: FinanceFilters
  setSelectedMember: (memberId: string | null) => void
  setDateRange: (dateRange: DateRange) => void
  setTransactionType: (type: TransactionTypeFilter) => void
  setSearchText: (text: string) => void
  resetFilters: () => void

  // CRUD Transactions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void

  // CRUD Goals
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void

  // CRUD CreditCards
  addCreditCard: (card: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateCreditCard: (id: string, updates: Partial<CreditCard>) => void
  deleteCreditCard: (id: string) => void

  // CRUD BankAccounts
  addBankAccount: (account: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBankAccount: (id: string, updates: Partial<BankAccount>) => void
  deleteBankAccount: (id: string) => void

  // CRUD FamilyMembers
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void
  deleteFamilyMember: (id: string) => void

  // Funções de cálculo
  getFilteredTransactions: () => Transaction[]
  calculateTotalBalance: () => number
  calculateIncomeForPeriod: (startDate?: Date, endDate?: Date) => number
  calculateExpensesForPeriod: (startDate?: Date, endDate?: Date) => number
  calculateExpensesByCategory: (startDate?: Date, endDate?: Date) => CategoryExpense[]
  calculateCategoryPercentage: (category: string, startDate?: Date, endDate?: Date) => number
  calculateSavingsRate: (startDate?: Date, endDate?: Date) => number
  getFinancialSummary: (startDate?: Date, endDate?: Date) => FinancialSummary
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

// Função auxiliar para gerar ID único
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Dados mock iniciais
const createMockData = () => {
  const now = new Date()
  const member1Id = generateId()
  const member2Id = generateId()
  const member3Id = generateId()

  const members: FamilyMember[] = [
    {
      id: member1Id,
      name: 'Moises Wilson',
      role: 'Pai',
      email: 'MoWill_95@gmail.com',
      avatarUrl: null,
      monthlyIncome: 8000,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: member2Id,
      name: 'Maria Silva',
      role: 'Mãe',
      email: 'maria.silva@email.com',
      avatarUrl: null,
      monthlyIncome: 6000,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: member3Id,
      name: 'João Wilson',
      role: 'Filho',
      email: null,
      avatarUrl: null,
      monthlyIncome: 0,
      createdAt: now,
      updatedAt: now,
    },
  ]

  const account1Id = generateId()
  const account2Id = generateId()
  const card1Id = generateId()
  const card2Id = generateId()
  const card3Id = generateId()

  const accounts: BankAccount[] = [
    {
      id: account1Id,
      name: 'Nubank Conta',
      holderId: member1Id,
      balance: 5000,
      bankName: 'Nubank',
      accountNumber: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: account2Id,
      name: 'Banco do Brasil',
      holderId: member2Id,
      balance: 3000,
      bankName: 'Banco do Brasil',
      accountNumber: null,
      createdAt: now,
      updatedAt: now,
    },
  ]

  const cards: CreditCard[] = [
    {
      id: card1Id,
      name: 'Nubank Mastercard',
      holderId: member1Id,
      closingDay: 10,
      dueDay: 20,
      limit: 10000,
      currentBill: 3500,
      theme: 'black',
      lastDigits: '6769',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: card2Id,
      name: 'PicPay Visa',
      holderId: member1Id,
      closingDay: 5,
      dueDay: 15,
      limit: 5000,
      currentBill: 1200,
      theme: 'lime',
      lastDigits: '1234',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: card3Id,
      name: 'XP Investimentos',
      holderId: member2Id,
      closingDay: 15,
      dueDay: 25,
      limit: 8000,
      currentBill: 2000,
      theme: 'white',
      lastDigits: '5678',
      createdAt: now,
      updatedAt: now,
    },
  ]

  const transactions: Transaction[] = []
  const categories = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Roupas', 'Contas']
  const incomeCategories = ['Salário', 'Freelance', 'Investimentos']

  // Criar 25-30 transações
  for (let i = 0; i < 28; i++) {
    const daysAgo = Math.floor(Math.random() * 90) // Últimos 90 dias
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)

    const isIncome = Math.random() > 0.6 // 40% receitas, 60% despesas
    const type: 'income' | 'expense' = isIncome ? 'income' : 'expense'
    const category = isIncome
      ? incomeCategories[Math.floor(Math.random() * incomeCategories.length)]
      : categories[Math.floor(Math.random() * categories.length)]

    const amount = isIncome
      ? Math.floor(Math.random() * 5000) + 1000 // R$ 1.000 - R$ 6.000
      : Math.floor(Math.random() * 2000) + 50 // R$ 50 - R$ 2.050

    const memberId = [member1Id, member2Id, null][Math.floor(Math.random() * 3)]
    const accountId = [account1Id, account2Id, card1Id, card2Id, card3Id][
      Math.floor(Math.random() * 5)
    ]

    transactions.push({
      id: generateId(),
      type,
      amount,
      description: `${type === 'income' ? 'Receita' : 'Despesa'} - ${category}`,
      category,
      date,
      accountId,
      memberId,
      installments: type === 'expense' && accountId && (cards.find(c => c.id === accountId) !== undefined) ? Math.floor(Math.random() * 6) + 1 : 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: Math.random() > 0.8, // 20% recorrentes
      isPaid: type === 'income' || Math.random() > 0.3, // 70% pagas
      createdAt: date,
      updatedAt: date,
    })
  }

  const goals: Goal[] = [
    {
      id: generateId(),
      title: 'Viagem para Europa',
      description: 'Economizar para viagem de 15 dias',
      targetAmount: 30000,
      currentAmount: 12000,
      deadline: new Date(now.getFullYear() + 1, 5, 1), // Junho do próximo ano
      category: 'Viagem',
      memberId: null,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      title: 'Reserva de Emergência',
      description: '6 meses de despesas',
      targetAmount: 50000,
      currentAmount: 25000,
      deadline: null,
      category: 'Reserva',
      memberId: null,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      title: 'Carro Novo',
      description: 'Entrada para financiamento',
      targetAmount: 20000,
      currentAmount: 8000,
      deadline: new Date(now.getFullYear(), 11, 31), // Dezembro deste ano
      category: 'Automóvel',
      memberId: member1Id,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      title: 'Faculdade do João',
      description: 'Economia para mensalidades',
      targetAmount: 15000,
      currentAmount: 5000,
      deadline: new Date(now.getFullYear() + 1, 1, 1), // Fevereiro do próximo ano
      category: 'Educação',
      memberId: member3Id,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
    },
  ]

  return { members, accounts, cards, transactions, goals }
}

interface FinanceProviderProps {
  children: ReactNode
}

export function FinanceProvider({ children }: FinanceProviderProps) {
  const mockData = useMemo(() => createMockData(), [])

  // Estado das entidades
  const [transactions, setTransactions] = useState<Transaction[]>(mockData.transactions)
  const [goals, setGoals] = useState<Goal[]>(mockData.goals)
  const [creditCards, setCreditCards] = useState<CreditCard[]>(mockData.cards)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockData.accounts)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(mockData.members)

  // Estado dos filtros
  const [filters, setFilters] = useState<FinanceFilters>({
    selectedMember: null,
    dateRange: { startDate: null, endDate: null },
    transactionType: 'all',
    searchText: '',
  })

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
  const addTransaction = useCallback(
    (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date()
      const newTransaction: Transaction = {
        ...transactionData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      }
      setTransactions((prev) => [...prev, newTransaction])
    },
    []
  )

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t))
    )
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // CRUD Goals
  const addGoal = useCallback((goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date()
    const newGoal: Goal = {
      ...goalData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setGoals((prev) => [...prev, newGoal])
  }, [])

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g))
    )
  }, [])

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }, [])

  // CRUD CreditCards
  const addCreditCard = useCallback(
    (cardData: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date()
      const newCard: CreditCard = {
        ...cardData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      }
      setCreditCards((prev) => [...prev, newCard])
    },
    []
  )

  const updateCreditCard = useCallback((id: string, updates: Partial<CreditCard>) => {
    setCreditCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c))
    )
  }, [])

  const deleteCreditCard = useCallback((id: string) => {
    setCreditCards((prev) => prev.filter((c) => c.id !== id))
  }, [])

  // CRUD BankAccounts
  const addBankAccount = useCallback(
    (accountData: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date()
      const newAccount: BankAccount = {
        ...accountData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      }
      setBankAccounts((prev) => [...prev, newAccount])
    },
    []
  )

  const updateBankAccount = useCallback((id: string, updates: Partial<BankAccount>) => {
    setBankAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a))
    )
  }, [])

  const deleteBankAccount = useCallback((id: string) => {
    setBankAccounts((prev) => prev.filter((a) => a.id !== id))
  }, [])

  // CRUD FamilyMembers
  const addFamilyMember = useCallback(
    (memberData: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date()
      const newMember: FamilyMember = {
        ...memberData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      }
      setFamilyMembers((prev) => [...prev, newMember])
    },
    []
  )

  const updateFamilyMember = useCallback((id: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates, updatedAt: new Date() } : m))
    )
  }, [])

  const deleteFamilyMember = useCallback((id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id))
  }, [])

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
      filtered = filtered.filter((t) => t.date >= filters.dateRange.startDate!)
    }
    if (filters.dateRange.endDate) {
      const endDate = new Date(filters.dateRange.endDate)
      endDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((t) => t.date <= endDate)
    }

    // Filtro por texto de busca
    if (filters.searchText.trim()) {
      const searchLower = filters.searchText.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchLower) ||
          t.category.toLowerCase().includes(searchLower)
      )
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [transactions, filters])

  const calculateTotalBalance = useCallback((): number => {
    const accountsBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0)
    const cardsAvailable = creditCards.reduce(
      (sum, card) => sum + (card.limit - card.currentBill),
      0
    )
    return accountsBalance + cardsAvailable
  }, [bankAccounts, creditCards])

  const calculateIncomeForPeriod = useCallback(
    (startDate?: Date, endDate?: Date): number => {
      let filtered = transactions.filter((t) => t.type === 'income' && t.status === 'completed')

      if (startDate) {
        filtered = filtered.filter((t) => t.date >= startDate)
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        filtered = filtered.filter((t) => t.date <= end)
      }

      return filtered.reduce((sum, t) => sum + t.amount, 0)
    },
    [transactions]
  )

  const calculateExpensesForPeriod = useCallback(
    (startDate?: Date, endDate?: Date): number => {
      let filtered = transactions.filter((t) => t.type === 'expense' && t.status === 'completed')

      if (startDate) {
        filtered = filtered.filter((t) => t.date >= startDate)
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        filtered = filtered.filter((t) => t.date <= end)
      }

      return filtered.reduce((sum, t) => sum + t.amount, 0)
    },
    [transactions]
  )

  const calculateExpensesByCategory = useCallback(
    (startDate?: Date, endDate?: Date): CategoryExpense[] => {
      let filtered = transactions.filter((t) => t.type === 'expense' && t.status === 'completed')

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
        const current = categoryMap.get(t.category) || 0
        categoryMap.set(t.category, current + t.amount)
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
      const income = calculateIncomeForPeriod(startDate, endDate)
      const expenses = calculateExpensesForPeriod(startDate, endDate)
      const balance = calculateTotalBalance()
      const savingsRate = calculateSavingsRate(startDate, endDate)

      return {
        totalBalance: balance,
        totalIncome: income,
        totalExpenses: expenses,
        savingsRate,
      }
    },
    [calculateIncomeForPeriod, calculateExpensesForPeriod, calculateTotalBalance, calculateSavingsRate]
  )

  const value: FinanceContextType = {
    transactions,
    goals,
    creditCards,
    bankAccounts,
    familyMembers,
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
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
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
