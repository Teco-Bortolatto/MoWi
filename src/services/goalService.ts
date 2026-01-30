import { supabase } from '../lib/supabase'
import { Goal } from '../types'

export interface CreateGoalInput {
  title: string
  description?: string | null
  targetAmount: number
  currentAmount?: number
  deadline?: Date | null
  category?: string | null
  memberId?: string | null
}

export interface UpdateGoalInput {
  title?: string
  description?: string | null
  targetAmount?: number
  currentAmount?: number
  deadline?: Date | null
  category?: string | null
  memberId?: string | null
  isCompleted?: boolean
}

/**
 * Service para gerenciar metas (goals)
 */
export const goalService = {
  /**
   * Buscar todas as metas do usuário
   */
  async getAll(): Promise<Goal[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(mapGoal)
  },

  /**
   * Buscar uma meta por ID
   */
  async getById(id: string): Promise<Goal | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data ? mapGoal(data) : null
  },

  /**
   * Criar nova meta
   */
  async create(input: CreateGoalInput): Promise<Goal> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        title: input.title,
        description: input.description,
        target_amount: input.targetAmount,
        current_amount: input.currentAmount || 0,
        deadline: input.deadline ? input.deadline.toISOString().split('T')[0] : null,
        category: input.category,
        member_id: input.memberId,
      })
      .select()
      .single()

    if (error) throw error
    return mapGoal(data)
  },

  /**
   * Atualizar meta
   */
  async update(id: string, input: UpdateGoalInput): Promise<Goal> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const updateData: any = {}
    if (input.title !== undefined) updateData.title = input.title
    if (input.description !== undefined) updateData.description = input.description
    if (input.targetAmount !== undefined) updateData.target_amount = input.targetAmount
    if (input.currentAmount !== undefined) updateData.current_amount = input.currentAmount
    if (input.deadline !== undefined) updateData.deadline = input.deadline ? input.deadline.toISOString().split('T')[0] : null
    if (input.category !== undefined) updateData.category = input.category
    if (input.memberId !== undefined) updateData.member_id = input.memberId
    if (input.isCompleted !== undefined) updateData.is_completed = input.isCompleted

    const { data, error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return mapGoal(data)
  },

  /**
   * Deletar meta
   */
  async delete(id: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },
}

/**
 * Mapear dados do banco para o formato da aplicação
 */
function mapGoal(data: any): Goal {
  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    description: data.description,
    targetAmount: parseFloat(data.target_amount),
    currentAmount: parseFloat(data.current_amount),
    deadline: data.deadline ? new Date(data.deadline) : null,
    category: data.category,
    memberId: data.member_id,
    isCompleted: data.is_completed,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}
