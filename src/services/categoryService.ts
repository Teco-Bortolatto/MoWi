import { supabase } from '../lib/supabase'

export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Category {
  id: string
  userId: string
  name: string
  icon: string
  type: TransactionType
  color: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateCategoryInput {
  name: string
  icon?: string
  type: TransactionType
  color?: string
}

export interface UpdateCategoryInput {
  name?: string
  icon?: string
  color?: string
  isActive?: boolean
}

/**
 * Service para gerenciar categorias
 */
export const categoryService = {
  /**
   * Buscar todas as categorias do usuário
   */
  async getAll(type?: TransactionType): Promise<Category[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    let query = supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (type) {
      query = query.eq('type', type)
    }

    query = query.order('name', { ascending: true })

    const { data, error } = await query

    if (error) throw error

    return data.map(mapCategory)
  },

  /**
   * Buscar uma categoria por ID
   */
  async getById(id: string): Promise<Category | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data ? mapCategory(data) : null
  },

  /**
   * Criar nova categoria
   */
  async create(input: CreateCategoryInput): Promise<Category> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name: input.name,
        icon: input.icon || '📌',
        type: input.type,
        color: input.color || '#3247FF',
      })
      .select()
      .single()

    if (error) throw error
    return mapCategory(data)
  },

  /**
   * Atualizar categoria
   */
  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const updateData: any = {}
    if (input.name !== undefined) updateData.name = input.name
    if (input.icon !== undefined) updateData.icon = input.icon
    if (input.color !== undefined) updateData.color = input.color
    if (input.isActive !== undefined) updateData.is_active = input.isActive

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return mapCategory(data)
  },

  /**
   * Deletar categoria (soft delete)
   */
  async delete(id: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('categories')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },
}

/**
 * Mapear dados do banco para o formato da aplicação
 */
function mapCategory(data: any): Category {
  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    icon: data.icon,
    type: data.type,
    color: data.color,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}
