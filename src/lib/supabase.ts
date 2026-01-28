import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

let client: SupabaseClient | null = null

/**
 * Retorna true se as variáveis de ambiente do Supabase estão definidas.
 * Use para exibir mensagem de configuração antes de tentar autenticar.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

/**
 * Retorna o cliente Supabase. Cria o cliente na primeira chamada.
 * Só faz throw quando o método for invocado sem envs configuradas
 * (evita derrubar a app na importação do módulo).
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Missing Supabase environment variables. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      )
    }
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  }
  return client
}

/**
 * Cliente Supabase. Acessos delegam a getSupabase(), então o throw por
 * envs faltando só ocorre no primeiro uso (ex.: auth.getSession), não na importação.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop: string) {
    return (getSupabase() as unknown as Record<string, unknown>)[prop]
  },
})

// Tipos do banco de dados (serão gerados automaticamente)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          user_id: string
          name: string
          role: string
          avatar_url: string | null
          monthly_income: number
          color: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          role: string
          avatar_url?: string | null
          monthly_income?: number
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          role?: string
          avatar_url?: string | null
          monthly_income?: number
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string
          type: 'INCOME' | 'EXPENSE'
          color: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          icon?: string
          type: 'INCOME' | 'EXPENSE'
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          icon?: string
          type?: 'INCOME' | 'EXPENSE'
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD'
          name: string
          bank: string
          last_digits: string | null
          holder_id: string
          balance: number
          credit_limit: number | null
          current_bill: number
          due_day: number | null
          closing_day: number | null
          theme: string | null
          logo_url: string | null
          color: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD'
          name: string
          bank: string
          last_digits?: string | null
          holder_id: string
          balance?: number
          credit_limit?: number | null
          current_bill?: number
          due_day?: number | null
          closing_day?: number | null
          theme?: string | null
          logo_url?: string | null
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD'
          name?: string
          bank?: string
          last_digits?: string | null
          holder_id?: string
          balance?: number
          credit_limit?: number | null
          current_bill?: number
          due_day?: number | null
          closing_day?: number | null
          theme?: string | null
          logo_url?: string | null
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'INCOME' | 'EXPENSE'
          amount: number
          description: string
          date: string
          category_id: string | null
          account_id: string | null
          member_id: string | null
          installment_number: number | null
          total_installments: number
          parent_transaction_id: string | null
          is_recurring: boolean
          recurring_transaction_id: string | null
          status: 'PENDING' | 'COMPLETED'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'INCOME' | 'EXPENSE'
          amount: number
          description: string
          date: string
          category_id?: string | null
          account_id?: string | null
          member_id?: string | null
          installment_number?: number | null
          total_installments?: number
          parent_transaction_id?: string | null
          is_recurring?: boolean
          recurring_transaction_id?: string | null
          status?: 'PENDING' | 'COMPLETED'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'INCOME' | 'EXPENSE'
          amount?: number
          description?: string
          date?: string
          category_id?: string | null
          account_id?: string | null
          member_id?: string | null
          installment_number?: number | null
          total_installments?: number
          parent_transaction_id?: string | null
          is_recurring?: boolean
          recurring_transaction_id?: string | null
          status?: 'PENDING' | 'COMPLETED'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      recurring_transactions: {
        Row: {
          id: string
          user_id: string
          type: 'INCOME' | 'EXPENSE'
          amount: number
          description: string
          category_id: string | null
          account_id: string | null
          member_id: string | null
          frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
          day_of_month: number | null
          day_of_week: number | null
          start_date: string
          end_date: string | null
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type?: 'INCOME' | 'EXPENSE'
          amount: number
          description: string
          category_id?: string | null
          account_id?: string | null
          member_id?: string | null
          frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
          day_of_month?: number | null
          day_of_week?: number | null
          start_date: string
          end_date?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'INCOME' | 'EXPENSE'
          amount?: number
          description?: string
          category_id?: string | null
          account_id?: string | null
          member_id?: string | null
          frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
          day_of_month?: number | null
          day_of_week?: number | null
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
