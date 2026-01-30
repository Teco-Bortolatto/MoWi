import { useState } from 'react'
import { useFinance } from '../../../contexts'
import { Modal } from '../../ui/Modal'
import { Icon } from '../../ui/Icon'
import { Button } from '../../ui/Button'
import { formatCurrency } from '../../../utils/formatCurrency'

interface NewFamilyMemberModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewFamilyMemberModal({ isOpen, onClose }: NewFamilyMemberModalProps) {
  const { addFamilyMember } = useFinance()

  const [name, setName] = useState('')
  const [role, setRole] = useState('Membro')
  const [monthlyIncome, setMonthlyIncome] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) return

    const incomeValue = parseFloat(monthlyIncome.replace(/[^\d,]/g, '').replace(',', '.')) || 0

    addFamilyMember({
      name,
      role,
      email: null,
      avatarUrl: null,
      monthlyIncome: incomeValue,
    })

    // Reset
    setName('')
    setRole('Membro')
    setMonthlyIncome('')

    onClose()
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
      title="Novo familiar"
      subtitle="Adicione alguém para participar do controle financeiro."
      icon={<Icon name="user" size={20} color="var(--color-text-primary)" />}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-layout-component)' }}>
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
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-padding-input)',
                  borderRadius: 'var(--shape-radius-input)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--color-border-input-default)',
                  fontSize: 'var(--font-size-input-medium)',
                  color: 'var(--color-text-primary)',
                  backgroundColor: 'var(--color-background-input-default)',
                }}
              >
                <option>Membro</option>
                <option>Pai</option>
                <option>Mãe</option>
                <option>Filho</option>
                <option>Filha</option>
                <option>Avô</option>
                <option>Avó</option>
              </select>
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
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="medium"
          >
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
