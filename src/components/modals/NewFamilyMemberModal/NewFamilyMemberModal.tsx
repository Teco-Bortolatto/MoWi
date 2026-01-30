import { useState, useEffect } from 'react'
import { useFinance } from '../../../contexts'
import { Modal } from '../../ui/Modal'
import { Icon } from '../../ui/Icon'
import { Button } from '../../ui/Button'
import { Avatar } from '../../ui/Avatar'
import { formatCurrency } from '../../../utils/formatCurrency'
import { storageService } from '../../../services/storageService'
import { STORAGE_MAX_AVATAR_BYTES } from '../../../constants'
import type { FamilyMember } from '../../../types'

interface NewFamilyMemberModalProps {
  isOpen: boolean
  onClose: () => void
  /** Se informado, modal abre em modo edição */
  member?: FamilyMember | null
}

const ROLE_OPTIONS = ['Membro', 'Pai', 'Mãe', 'Filho', 'Filha', 'Avô', 'Avó']

export function NewFamilyMemberModal({ isOpen, onClose, member }: NewFamilyMemberModalProps) {
  const { addFamilyMember, updateFamilyMember } = useFinance()
  const [name, setName] = useState('')
  const [role, setRole] = useState('Membro')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)

  const isEdit = Boolean(member?.id)

  useEffect(() => {
    if (isOpen) {
      if (member) {
        setName(member.name)
        setRole(member.role)
        setMonthlyIncome(formatCurrency(member.monthlyIncome))
        setAvatarUrl(member.avatarUrl)
        setPhotoPreview(member.avatarUrl ?? null)
        setPhotoFile(null)
      } else {
        setName('')
        setRole('Membro')
        setMonthlyIncome('')
        setAvatarUrl(null)
        setPhotoPreview(null)
        setPhotoFile(null)
      }
      setPhotoError(null)
    }
  }, [isOpen, member])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setPhotoError(null)
    if (!file) {
      setPhotoFile(null)
      setPhotoPreview(null)
      return
    }
    if (!file.type.startsWith('image/')) {
      setPhotoError('Selecione uma imagem (JPG, PNG ou WebP).')
      return
    }
    if (file.size > STORAGE_MAX_AVATAR_BYTES) {
      setPhotoError(`Imagem muito grande. Máximo: ${(STORAGE_MAX_AVATAR_BYTES / 1024).toFixed(0)} KB`)
      return
    }
    setPhotoFile(file)
    const url = URL.createObjectURL(file)
    setPhotoPreview(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    const incomeValue = parseFloat(monthlyIncome.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    setLoading(true)
    setPhotoError(null)

    try {
      let finalAvatarUrl = avatarUrl
      if (photoFile) {
        finalAvatarUrl = await storageService.uploadFile('avatars', photoFile)
      }

      if (isEdit && member) {
        await updateFamilyMember(member.id, {
          name,
          role,
          monthlyIncome: incomeValue,
          avatarUrl: finalAvatarUrl,
        })
      } else {
        await addFamilyMember({
          name,
          role,
          email: null,
          avatarUrl: finalAvatarUrl,
          monthlyIncome: incomeValue,
        })
      }

      setName('')
      setRole('Membro')
      setMonthlyIncome('')
      setAvatarUrl(null)
      setPhotoFile(null)
      setPhotoPreview(null)
      onClose()
    } catch (err) {
      console.error(err)
      setPhotoError(err instanceof Error ? err.message : 'Erro ao salvar.')
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

  const maxKb = (STORAGE_MAX_AVATAR_BYTES / 1024).toFixed(0)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar familiar' : 'Novo familiar'}
      subtitle={isEdit ? 'Altere os dados do membro.' : 'Adicione alguém para participar do controle financeiro.'}
      icon={<Icon name="user" size={20} color="var(--color-text-primary)" />}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-layout-component)' }}>
          {/* Foto de perfil */}
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
              Foto de perfil (máx. {maxKb} KB)
            </label>
            <div className="flex items-center" style={{ gap: 'var(--space-layout-component)' }}>
              <label className="relative flex-shrink-0 cursor-pointer">
                <Avatar
                  src={photoPreview ?? avatarUrl ?? undefined}
                  alt={name || 'Membro'}
                  size="lg"
                />
                <span
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 hover:opacity-100 transition-opacity"
                  style={{ fontSize: 'var(--font-size-text-body-x-small)' }}
                >
                  Trocar
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handlePhotoChange}
                />
              </label>
              <div>
                <p style={{ fontSize: 'var(--font-size-text-body-small)', color: 'var(--color-text-secondary)' }}>
                  Clique na foto para escolher. Tamanho máximo: {maxKb} KB (plano gratuito).
                </p>
                {photoError && (
                  <p style={{ fontSize: 'var(--font-size-text-body-small)', color: 'var(--color-text-error)', marginTop: 'var(--space-8)' }}>
                    {photoError}
                  </p>
                )}
              </div>
            </div>
          </div>

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
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do familiar"
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

          <div className="grid grid-cols-2" style={{ gap: 'var(--space-layout-component)' }}>
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
                Função / Parentesco
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
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
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
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
                Renda
              </label>
              <input
                type="text"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(formatAmountInput(e.target.value))}
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
          </div>
        </div>

        <div
          className="flex justify-end"
          style={{
            marginTop: 'var(--space-layout-container)',
            gap: 'var(--space-layout-component)',
          }}
        >
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            size="medium"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="medium"
            disabled={loading}
          >
            {loading ? 'Salvando…' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
