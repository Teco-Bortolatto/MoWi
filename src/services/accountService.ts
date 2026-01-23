import { supabase } from '../lib/supabase'
import { Account, AccountType, CreditCardTheme } from '../types'

export interface CreateAccountInput {
  type: AccountType
  name: string
  bank: string
  lastDigits?: string | null
  holderId: string
  balance?: number
  creditLimit?: number | null
  currentBill?: number
  dueDay?: number | null
  closingDay?: number | null
  theme?: CreditCardTheme | null
  logoUrl?: string | null
  color?: string
}

export interface UpdateAccountInput {
  name?: string
  bank?: string
  lastDigits?: string | null
  holderId?: string
  balance?: number
  creditLimit?: number | null
  currentBill?: number
  dueDay?: number | null
  closingDay?: number | null
  theme?: CreditCardTheme | null
  logoUrl?: string | null
  color?: string
  isActive?: boolean
}

/**
 * Service para gerenciar contas e cartões
 */
export const accountService = {
  /**
   * Buscar todas as contas do usuário atual
   */
  async getAll(): Promise<Account[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (error) throw error

    return data.map(mapAccount)
  },

  /**
   * Buscar apenas cartões de crédito
   */
  async getCreditCards(): Promise<Account[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'CREDIT_CARD')
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (error) throw error

    return data.map(mapAccount)
  },

  /**
   * Buscar apenas contas bancárias
   */
  async getBankAccounts(): Promise<Account[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .in('type', ['CHECKING', 'SAVINGS'])
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (error) throw error

    return data.map(mapAccount)
  },

  /**
   * Buscar uma conta por ID
   */
  async getById(id: string): Promise<Account | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data ? mapAccount(data) : null
  },

  /**
   * Criar nova conta ou cartão
   */
  async create(input: CreateAccountInput): Promise<Account> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const insertData: any = {
      user_id: user.id,
      type: input.type,
      name: input.name,
      bank: input.bank,
      holder_id: input.holderId,
      last_digits: input.lastDigits || null,
      color: input.color || '#3247FF',
    }

    // Campos específicos por tipo
    if (input.type === 'CREDIT_CARD') {
      insertData.credit_limit = input.creditLimit || null
      insertData.current_bill = input.currentBill || 0
      insertData.due_day = input.dueDay || null
      insertData.closing_day = input.closingDay || null
      insertData.theme = input.theme || 'black'
      insertData.balance = 0
    } else {
      insertData.balance = input.balance || 0
      insertData.credit_limit = null
      insertData.current_bill = 0
      insertData.due_day = null
      insertData.closing_day = null
      insertData.theme = null
    }

    if (input.logoUrl) {
      insertData.logo_url = input.logoUrl
    }

    const { data, error } = await supabase
      .from('accounts')
      .insert(insertData)
      .select()
      .single()

    if (error) throw error
    return mapAccount(data)
  },

  /**
   * Atualizar conta ou cartão
   */
  async update(id: string, input: UpdateAccountInput): Promise<Account> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const updateData: any = {}
    if (input.name !== undefined) updateData.name = input.name
    if (input.bank !== undefined) updateData.bank = input.bank
    if (input.lastDigits !== undefined) updateData.last_digits = input.lastDigits
    if (input.holderId !== undefined) updateData.holder_id = input.holderId
    if (input.balance !== undefined) updateData.balance = input.balance
    if (input.creditLimit !== undefined) updateData.credit_limit = input.creditLimit
    if (input.currentBill !== undefined) updateData.current_bill = input.currentBill
    if (input.dueDay !== undefined) updateData.due_day = input.dueDay
    if (input.closingDay !== undefined) updateData.closing_day = input.closingDay
    if (input.theme !== undefined) updateData.theme = input.theme
    if (input.logoUrl !== undefined) updateData.logo_url = input.logoUrl
    if (input.color !== undefined) updateData.color = input.color
    if (input.isActive !== undefined) updateData.is_active = input.isActive

    const { data, error } = await supabase
      .from('accounts')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return mapAccount(data)
  },

  /**
   * Deletar conta ou cartão (soft delete)
   */
  async delete(id: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('accounts')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },
}

/**
 * Mapear dados do banco para o formato da aplicação
 */
function mapAccount(data: any): Account {
  return {
    id: data.id,
    userId: data.user_id,
    type: data.type,
    name: data.name,
    bank: data.bank,
    lastDigits: data.last_digits,
    holderId: data.holder_id,
    balance: parseFloat(data.balance),
    creditLimit: data.credit_limit ? parseFloat(data.credit_limit) : null,
    currentBill: parseFloat(data.current_bill),
    dueDay: data.due_day,
    closingDay: data.closing_day,
    theme: data.theme as CreditCardTheme | null,
    logoUrl: data.logo_url,
    color: data.color,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}
