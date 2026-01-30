import { useState } from 'react'
import { useFinance } from '../../../contexts'
import { Modal } from '../../ui/Modal'
import { Icon } from '../../ui/Icon'
import { Button } from '../../ui/Button'
import { formatCurrency } from '../../../utils/formatCurrency'
import { storageService } from '../../../services/storageService'
import { STORAGE_MAX_GOAL_THUMB_BYTES } from '../../../constants'

interface NewGoalModalProps {
  isOpen: boolean
  onClose: () => void
}

const goalIcons = ['✈️', '💰', '🚗', '📚', '🏠', '🏥', '🎮', '🎯', '💍', '📱']

export function NewGoalModal({ isOpen, onClose }: NewGoalModalProps) {
  const { addGoal, familyMembers } = useFinance()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('')
  const [deadline, setDeadline] = useState<Date | null>(null)
  const [selectedIcon, setSelectedIcon] = useState(goalIcons[0])
  const [memberId, setMemberId] = useState<string | null>(null)
  const [category, setCategory] = useState('')
  const [thumbFile, setThumbFile] = useState<File | null>(null)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)
  const [thumbError, setThumbError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setThumbError(null)
    if (!file) {
      setThumbFile(null)
      setThumbPreview(null)
      return
    }
    if (!file.type.startsWith('image/')) {
      setThumbError('Selecione uma imagem (JPG, PNG ou WebP).')
      return
    }
    if (file.size > STORAGE_MAX_GOAL_THUMB_BYTES) {
      setThumbError(`Imagem muito grande. Máximo: ${(STORAGE_MAX_GOAL_THUMB_BYTES / 1024).toFixed(0)} KB`)
      return
    }
    setThumbFile(file)
    setThumbPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !targetAmount) {
      return
    }

    const targetValue = parseFloat(targetAmount.replace(/[^\d,]/g, '').replace(',', '.'))
    const currentValue = parseFloat(
      (currentAmount || '0').replace(/[^\d,]/g, '').replace(',', '.')
    )

    if (isNaN(targetValue) || targetValue <= 0) {
      return
    }

    setLoading(true)
    setThumbError(null)

    try {
      let imageUrl: string | null = null
      if (thumbFile) {
        imageUrl = await storageService.uploadFile('goal-thumbs', thumbFile)
      }

      await addGoal({
        title,
        description: description || title,
        targetAmount: targetValue,
        currentAmount: currentValue,
        deadline,
        category: category || 'Outros',
        memberId,
        imageUrl,
        isCompleted: false,
      })

      // Reset form
      setTitle('')
      setDescription('')
      setTargetAmount('')
      setCurrentAmount('')
      setDeadline(null)
      setSelectedIcon(goalIcons[0])
      setMemberId(null)
      setCategory('')
      setThumbFile(null)
      setThumbPreview(null)
      onClose()
    } catch (err) {
      console.error(err)
      setThumbError(err instanceof Error ? err.message : 'Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  const formatAmountInput = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers === '') return ''
    const cents = parseInt(numbers, 10)
    return formatCurrency(cents / 100)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Objetivo"
      subtitle="Defina uma meta financeira e acompanhe seu progresso."
      icon={<Icon name="target" size={20} color="var(--color-text-primary)" />}
    >
      <form onSubmit={handleSubmit}>
        {/* Nome do Objetivo */}
        <div style={{ marginBottom: 'var(--space-layout-component)' }}>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--font-size-text-label)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-layout-element)',
              fontFeatureSettings: "'liga' off",
            }}
          >
            Nome do Objetivo
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Reserva de Emergência"
            required
            style={{
              width: '100%',
              padding: 'var(--space-padding-input)',
              borderRadius: 'var(--shape-radius-input)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border-input-default)',
              fontSize: 'var(--font-size-input-medium)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        {/* Descrição */}
        <div style={{ marginBottom: 'var(--space-layout-component)' }}>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--font-size-text-label)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-layout-element)',
              fontFeatureSettings: "'liga' off",
            }}
          >
            Descrição (opcional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: 6 meses de despesas"
            style={{
              width: '100%',
              padding: 'var(--space-padding-input)',
              borderRadius: 'var(--shape-radius-input)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border-input-default)',
              fontSize: 'var(--font-size-input-medium)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        {/* Thumb horizontal do objetivo (opcional) */}
        <div style={{ marginBottom: 'var(--space-layout-component)' }}>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--font-size-text-label)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-layout-element)',
              fontFeatureSettings: "'liga' off",
            }}
          >
            Thumb do objetivo (opcional, máx. 256 KB)
          </label>
          <div className="flex items-center" style={{ gap: 'var(--space-layout-component)' }}>
            {thumbPreview && (
              <img
                src={thumbPreview}
                alt="Preview thumb"
                style={{
                  width: 160,
                  height: 80,
                  objectFit: 'cover',
                  borderRadius: 'var(--shape-radius-button)',
                  border: '1px solid var(--color-border-default)',
                }}
              />
            )}
            <label
              className="cursor-pointer"
              style={{
                padding: 'var(--space-padding-button-small)',
                borderRadius: 'var(--shape-radius-button)',
                border: '1px dashed var(--color-border-default)',
                fontSize: 'var(--font-size-text-body-small)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {thumbPreview ? 'Trocar imagem' : 'Escolher imagem'}
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleThumbChange}
              />
            </label>
          </div>
          {thumbError && (
            <p style={{ fontSize: 'var(--font-size-text-body-small)', color: 'var(--color-text-error)', marginTop: 'var(--space-8)' }}>
              {thumbError}
            </p>
          )}
        </div>

        {/* Grid de campos */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'var(--space-layout-component)' }}>
          {/* Valor Alvo */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--font-size-text-label)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-layout-element)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Valor Alvo
            </label>
            <input
              type="text"
              value={targetAmount}
              onChange={(e) => setTargetAmount(formatAmountInput(e.target.value))}
              placeholder="R$ 0,00"
              required
              style={{
                width: '100%',
                padding: 'var(--space-padding-input)',
                borderRadius: 'var(--shape-radius-input)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--color-border-input-default)',
                fontSize: 'var(--font-size-input-medium)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          {/* Valor Inicial */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--font-size-text-label)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-layout-element)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Valor Inicial
            </label>
            <input
              type="text"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(formatAmountInput(e.target.value))}
              placeholder="R$ 0,00"
              style={{
                width: '100%',
                padding: 'var(--space-padding-input)',
                borderRadius: 'var(--shape-radius-input)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--color-border-input-default)',
                fontSize: 'var(--font-size-input-medium)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          {/* Data Limite */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--font-size-text-label)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-layout-element)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Data Limite (opcional)
            </label>
            <div className="relative">
              <input
                type="date"
                value={deadline ? deadline.toISOString().split('T')[0] : ''}
                onChange={(e) => setDeadline(e.target.value ? new Date(e.target.value) : null)}
                style={{
                  width: '100%',
                  minHeight: '58px',
                  padding: 'var(--space-padding-button-small)',
                  paddingRight: 'var(--space-padding-input)',
                  borderRadius: 'var(--shape-radius-input)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--color-border-input-default)',
                  fontSize: 'var(--font-size-input-medium)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--font-size-text-label)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-layout-element)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Categoria
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Viagem, Reserva, Casa..."
              style={{
                width: '100%',
                padding: 'var(--space-padding-input)',
                borderRadius: 'var(--shape-radius-input)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--color-border-input-default)',
                fontSize: 'var(--font-size-input-medium)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          {/* Responsável */}
          <div className="md:col-span-2">
            <label
              style={{
                display: 'block',
                fontSize: 'var(--font-size-text-label)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-layout-element)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Responsável
            </label>
            <div className="relative">
              <select
                value={memberId || ''}
                onChange={(e) => setMemberId(e.target.value || null)}
                style={{
                  width: '100%',
                  padding: 'var(--space-padding-input)',
                  paddingRight: 'calc(var(--space-12) + 16px)',
                  borderRadius: 'var(--shape-radius-input)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--color-border-input-default)',
                  fontSize: 'var(--font-size-input-medium)',
                  color: 'var(--color-text-primary)',
                  backgroundColor: 'var(--color-background-input-default)',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              >
                <option value="">Familiar (todos)</option>
                {familyMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <div
                className="absolute pointer-events-none"
                style={{ right: 'var(--space-12)', top: '50%', transform: 'translateY(-50%)' }}
              >
                <Icon name="chevron-down" size={16} color="var(--color-text-secondary)" />
              </div>
            </div>
          </div>
        </div>

        {/* Seletor de Ícone */}
        <div style={{ marginTop: 'var(--space-layout-component)' }}>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--font-size-text-label)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-layout-element)',
              fontFeatureSettings: "'liga' off",
            }}
          >
            Ícone
          </label>
          <div
            className="grid grid-cols-5 gap-4"
            style={{ marginBottom: 'var(--space-layout-component)' }}
          >
            {goalIcons.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setSelectedIcon(icon)}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: 'var(--shape-radius-icon)',
                  backgroundColor:
                    selectedIcon === icon
                      ? 'var(--color-background-action-primary)'
                      : 'var(--color-background-tertiary)',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor:
                    selectedIcon === icon
                      ? 'var(--color-background-action-primary)'
                      : 'var(--color-border-default)',
                  fontSize: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  if (selectedIcon !== icon) {
                    e.currentTarget.style.backgroundColor = 'var(--color-background-surface-active)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedIcon !== icon) {
                    e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                  }
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Botões */}
        <div
          className="flex justify-end"
          style={{
            marginTop: 'var(--space-layout-container)',
            gap: 'var(--space-layout-component)',
          }}
        >
          <Button type="button" onClick={onClose} variant="secondary" size="medium">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="medium" disabled={loading}>
            {loading ? 'Criando…' : 'Criar Objetivo'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
