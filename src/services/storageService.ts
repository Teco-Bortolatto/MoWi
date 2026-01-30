import { supabase } from '../lib/supabase'
import { STORAGE_MAX_AVATAR_BYTES, STORAGE_MAX_GOAL_THUMB_BYTES } from '../constants'

export type StorageBucket = 'avatars' | 'account-logos' | 'documents' | 'goal-thumbs'

const MAX_SIZE_BY_BUCKET: Record<StorageBucket, number> = {
  avatars: STORAGE_MAX_AVATAR_BYTES,
  'account-logos': 2 * 1024 * 1024, // 2MB (existente)
  documents: 10 * 1024 * 1024, // 10MB (existente)
  'goal-thumbs': STORAGE_MAX_GOAL_THUMB_BYTES,
}

export const storageService = {
  /**
   * Limite máximo em bytes para o bucket (plano gratuito, uso modesto).
   */
  getMaxFileSize(bucket: StorageBucket): number {
    return MAX_SIZE_BY_BUCKET[bucket] ?? STORAGE_MAX_AVATAR_BYTES
  },

  /**
   * Upload de arquivo para um bucket específico.
   * Valida tamanho conforme limite do bucket (avatars 512KB, goal-thumbs 256KB).
   */
  async uploadFile(
    bucket: StorageBucket,
    file: File,
    path?: string
  ): Promise<string> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const maxBytes = this.getMaxFileSize(bucket)
    if (file.size > maxBytes) {
      const maxMB = (maxBytes / (1024 * 1024)).toFixed(2)
      throw new Error(`Arquivo muito grande. Máximo: ${maxMB} MB`)
    }

    const fileExt = file.name.split('.').pop()
    const fileName = path || `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`

    const { error, data } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        upsert: true,
      })

    if (error) throw error

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return publicUrlData.publicUrl
  },

  /**
   * Deletar arquivo de um bucket
   */
  async deleteFile(bucket: StorageBucket, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) throw error
  },

  /**
   * Obter URL pública de um arquivo
   */
  getPublicUrl(bucket: StorageBucket, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }
}
