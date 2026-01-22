import { supabase } from '../lib/supabase'

export type TransactionType = 'INCOME' | 'EXPENSE'
export type TransactionStatus = 'PENDING' | 'COMPLETED'

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  amount: number
  description: string
  date: Date
  categoryId: string | null
  accountId: string | null
  memberId: string | null
  installmentNumber: number | null
  totalInstallments: number
  parentTransactionId: string | null
  isRecurring: boolean
  recurringTransactionId: string | null
  status: TransactionStatus
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateTransactionInput {
  type: TransactionType
  amount: number
  description: string
  date: Date
  categoryId?: string | null
  accountId?: string | null
  memberId?: string | null
  installmentNumber?: number | null
  totalInstallments?: number
  parentTransactionId?: string | null
  isRecurring?: boolean
  recurringTransactionId?: string | null
  status?: TransactionStatus
  notes?: string | null
}

export interface UpdateTransactionInput {
  type?: TransactionType
  amount?: number
  description?: string
  date?: Date
  categoryId?: string | null
  accountId?: string | null
  memberId?: string | null
  installmentNumber?: number | null
  totalInstallments?: number
  isRecurring?: boolean
  status?: TransactionStatus
  notes?: string | null
}

export interface TransactionFilters {
  type?: TransactionType
  categoryId?: string
  accountId?: string
  memberId?: string
  startDate?: Date
  endDate?: Date
  status?: TransactionStatus
  searchText?: string
}

/**
 * Service para gerenciar transações
 */
export const transactionService = {
  /**
   * Buscar todas as transações do usuário com filtros opcionais
   */
  async getAll(filters?: TransactionFilters): Promise<Transaction[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)

    if (filters) {
      if (filters.type) {
        query = query.eq('type', filters.type)
      }
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId)
      }
      if (filters.accountId) {
        query = query.eq('account_id', filters.accountId)
      }
      if (filters.memberId) {
        query = query.eq('member_id', filters.memberId)
      }
      if (filters.startDate) {
        query = query.gte('date', filters.startDate.toISOString().split('T')[0])
      }
      if (filters.endDate) {
        query = query.lte('date', filters.endDate.toISOString().split('T')[0])
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.searchText) {
        query = query.or(
          `description.ilike.%${filters.searchText}%,category_id.in.(select id from categories where name.ilike.%${filters.searchText}%)`
        )
      }
    }

    query = query.order('date', { ascending: false })

    const { data, error } = await query

    if (error) throw error

    return data.map(mapTransaction)
  },

  /**
   * Buscar uma transação por ID
   */
  async getById(id: string): Promise<Transaction | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data ? mapTransaction(data) : null
  },

  /**
   * Criar nova transação
   */
  async create(input: CreateTransactionInput): Promise<Transaction> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Se for parcelada, criar todas as parcelas
    const totalInstallments = input.totalInstallments || 1
    const transactions: any[] = []

    for (let i = 1; i <= totalInstallments; i++) {
      const transactionDate = new Date(input.date)
      if (i > 1) {
        transactionDate.setMonth(transactionDate.getMonth() + (i - 1))
      }

      const transactionData: any = {
        user_id: user.id,
        type: input.type,
        amount: input.amount,
        description: input.description,
        date: transactionDate.toISOString().split('T')[0],
        category_id: input.categoryId || null,
        account_id: input.accountId || null,
        member_id: input.memberId || null,
        installment_number: totalInstallments > 1 ? i : null,
        total_installments: totalInstallments,
        parent_transaction_id: i === 1 ? null : transactions[0]?.id || null,
        is_recurring: input.isRecurring || false,
        recurring_transaction_id: input.recurringTransactionId || null,
        status: input.status || 'COMPLETED',
        notes: input.notes || null,
      }

      transactions.push(transactionData)
    }

    // Inserir todas as parcelas
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactions)
      .select()

    if (error) throw error

    // Retornar a primeira transação (parcela principal)
    return mapTransaction(data[0])
  },

  /**
   * Atualizar transação
   */
  async update(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const updateData: any = {}
    if (input.type !== undefined) updateData.type = input.type
    if (input.amount !== undefined) updateData.amount = input.amount
    if (input.description !== undefined) updateData.description = input.description
    if (input.date !== undefined) updateData.date = input.date.toISOString().split('T')[0]
    if (input.categoryId !== undefined) updateData.category_id = input.categoryId
    if (input.accountId !== undefined) updateData.account_id = input.accountId
    if (input.memberId !== undefined) updateData.member_id = input.memberId
    if (input.installmentNumber !== undefined) updateData.installment_number = input.installmentNumber
    if (input.totalInstallments !== undefined) updateData.total_installments = input.totalInstallments
    if (input.isRecurring !== undefined) updateData.is_recurring = input.isRecurring
    if (input.status !== undefined) updateData.status = input.status
    if (input.notes !== undefined) updateData.notes = input.notes

    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return mapTransaction(data)
  },

  /**
   * Deletar transação
   */
  async delete(id: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },
}

/**
 * Mapear dados do banco para o formato da aplicação
 */
function mapTransaction(data: any): Transaction {
  return {
    id: data.id,
    userId: data.user_id,
    type: data.type,
    amount: parseFloat(data.amount),
    description: data.description,
    date: new Date(data.date),
    categoryId: data.category_id,
    accountId: data.account_id,
    memberId: data.member_id,
    installmentNumber: data.installment_number,
    totalInstallments: data.total_installments,
    parentTransactionId: data.parent_transaction_id,
    isRecurring: data.is_recurring,
    recurringTransactionId: data.recurring_transaction_id,
    status: data.status,
    notes: data.notes,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}
