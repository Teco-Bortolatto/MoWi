import { supabase } from '../lib/supabase'

export interface FamilyMember {
  id: string
  userId: string
  name: string
  role: string
  avatarUrl: string | null
  monthlyIncome: number
  color: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateFamilyMemberInput {
  name: string
  role: string
  avatarUrl?: string | null
  monthlyIncome?: number
  color?: string
}

export interface UpdateFamilyMemberInput {
  name?: string
  role?: string
  avatarUrl?: string | null
  monthlyIncome?: number
  color?: string
  isActive?: boolean
}

/**
 * Service para gerenciar membros da família
 */
export const familyMemberService = {
  /**
   * Buscar todos os membros da família do usuário atual
   */
  async getAll(): Promise<FamilyMember[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (error) throw error

    return data.map(mapFamilyMember)
  },

  /**
   * Buscar um membro por ID
   */
  async getById(id: string): Promise<FamilyMember | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data ? mapFamilyMember(data) : null
  },

  /**
   * Criar novo membro da família
   */
  async create(input: CreateFamilyMemberInput): Promise<FamilyMember> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('family_members')
      .insert({
        user_id: user.id,
        name: input.name,
        role: input.role,
        avatar_url: input.avatarUrl || null,
        monthly_income: input.monthlyIncome || 0,
        color: input.color || '#3247FF',
      })
      .select()
      .single()

    if (error) throw error
    return mapFamilyMember(data)
  },

  /**
   * Atualizar membro da família
   */
  async update(id: string, input: UpdateFamilyMemberInput): Promise<FamilyMember> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const updateData: any = {}
    if (input.name !== undefined) updateData.name = input.name
    if (input.role !== undefined) updateData.role = input.role
    if (input.avatarUrl !== undefined) updateData.avatar_url = input.avatarUrl
    if (input.monthlyIncome !== undefined) updateData.monthly_income = input.monthlyIncome
    if (input.color !== undefined) updateData.color = input.color
    if (input.isActive !== undefined) updateData.is_active = input.isActive

    const { data, error } = await supabase
      .from('family_members')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return mapFamilyMember(data)
  },

  /**
   * Deletar membro da família (soft delete)
   */
  async delete(id: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('family_members')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },
}

/**
 * Mapear dados do banco para o formato da aplicação
 */
function mapFamilyMember(data: any): FamilyMember {
  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    role: data.role,
    avatarUrl: data.avatar_url,
    monthlyIncome: parseFloat(data.monthly_income),
    color: data.color,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}
