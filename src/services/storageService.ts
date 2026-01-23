import { supabase } from '../lib/supabase'

export const storageService = {
  /**
   * Upload de arquivo para um bucket específico
   */
  async uploadFile(
    bucket: 'avatars' | 'account-logos' | 'documents',
    file: File,
    path?: string
  ): Promise<string> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Gerar um nome de arquivo único se não for fornecido um path
    const fileExt = file.name.split('.').pop()
    const fileName = path || `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`

    const { error, data } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        upsert: true,
      })

    if (error) throw error

    // Retornar a URL pública do arquivo
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return publicUrlData.publicUrl
  },

  /**
   * Deletar arquivo de um bucket
   */
  async deleteFile(bucket: 'avatars' | 'account-logos' | 'documents', path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) throw error
  },

  /**
   * Obter URL pública de um arquivo
   */
  getPublicUrl(bucket: 'avatars' | 'account-logos' | 'documents', path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }
}
