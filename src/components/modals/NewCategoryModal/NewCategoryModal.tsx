import { useState } from 'react'
import { Modal } from '../../ui/Modal'
import { Icon } from '../../ui/Icon'
import { Button } from '../../ui/Button'
import { categoryService } from '../../../services/categoryService'
import { TransactionType } from '../../../types'

interface NewCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  type: TransactionType
  onSuccess: () => void
}

const EMOJIS = ['📌', '💰', '🍔', '🚗', '🏠', '🏥', '🎮', '👕', '📚', '✈️', '🎁', '🔌', '🎬', '🏋️', '🐱']

export function NewCategoryModal({ isOpen, onClose, type, onSuccess }: NewCategoryModalProps) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('📌')
  const [color, setColor] = useState('#3247FF')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    setLoading(true)
    try {
      await categoryService.create({
        name,
        icon,
        type,
        color,
      })
      onSuccess()
      setName('')
      onClose()
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      alert('Erro ao criar categoria')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Categoria"
      subtitle={`Crie uma categoria para suas ${type === 'INCOME' ? 'receitas' : 'despesas'}.`}
      icon={<Icon name="Plus" size={20} color="var(--color-text-primary)" />}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-neutral-900 mb-2">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Assinaturas"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-neutral-900 mb-2">Ícone</label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setIcon(e)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all ${
                  icon === e ? 'border-primary-500 bg-primary-50' : 'border-neutral-100 hover:border-neutral-200'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Criar Categoria'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
