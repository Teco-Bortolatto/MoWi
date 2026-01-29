import { useState, useMemo } from 'react'
import { useFinance } from '../../../contexts'
import { Modal } from '../../ui/Modal'
import { Icon } from '../../ui/Icon'
import { Button } from '../../ui/Button'
import { formatCurrency } from '../../../utils/formatCurrency'
import { Goal } from '../../../types'

interface AddGoalValueModalProps {
  isOpen: boolean
  onClose: () => void
  goal: Goal | null
}

export function AddGoalValueModal({ isOpen, onClose, goal }: AddGoalValueModalProps) {
  const { updateGoal, accounts } = useFinance()
  const bankAccounts = useMemo(
    () => accounts.filter((acc) => acc.type !== 'CREDIT_CARD'),
    [accounts]
  )
  const [amount, setAmount] = useState('')
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!goal || !amount) {
      return
    }

    const amountValue = parseFloat(amount.replace(/[^\d,]/g, '').replace(',', '.'))

    if (isNaN(amountValue) || amountValue <= 0) {
      return
    }

    // Verificar se a conta tem saldo suficiente
    if (selectedAccountId) {
      const account = bankAccounts.find((acc) => acc.id === selectedAccountId)
      if (account && account.balance < amountValue) {
        alert('Saldo insuficiente na conta selecionada')
        return
      }

      // Aqui você poderia implementar a lógica de transferência real
      // Por enquanto, apenas atualizamos o objetivo
    }

    updateGoal(goal.id, {
      currentAmount: goal.currentAmount + amountValue,
    })

    // Reset form
    setAmount('')
    setSelectedAccountId(null)

    onClose()
  }

  const formatAmountInput = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers === '') return ''
    const cents = parseInt(numbers, 10)
    return formatCurrency(cents / 100)
  }

  if (!goal) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar Valor"
      subtitle={`Adicione um valor ao objetivo "${goal.title}"`}
      icon={<Icon name="arrow-up" size={20} color="var(--color-text-primary)" />}
    >
      <form onSubmit={handleSubmit}>
        {/* Valor */}
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
            Valor a Adicionar
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(formatAmountInput(e.target.value))}
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

        {/* Conta de Origem (opcional) */}
        {bankAccounts.length > 0 && (
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
              Transferir de (opcional)
            </label>
            <div className="relative">
              <select
                value={selectedAccountId || ''}
                onChange={(e) => setSelectedAccountId(e.target.value || null)}
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
                <option value="">Adicionar sem transferir</option>
                {bankAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} - {formatCurrency(account.balance)}
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
        )}

        {/* Informações do Objetivo */}
        <div
          style={{
            padding: 'var(--space-layout-component)',
            borderRadius: 'var(--shape-radius-icon)',
            backgroundColor: 'var(--color-background-tertiary)',
            marginBottom: 'var(--space-layout-component)',
          }}
        >
          <div className="flex justify-between" style={{ marginBottom: 'var(--space-gap-tight)' }}>
            <span
              style={{
                fontSize: 'var(--font-size-text-caption)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Valor Atual:
            </span>
            <span
              style={{
                fontSize: 'var(--font-size-text-label)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              {formatCurrency(goal.currentAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              style={{
                fontSize: 'var(--font-size-text-caption)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Meta:
            </span>
            <span
              style={{
                fontSize: 'var(--font-size-text-label)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              {formatCurrency(goal.targetAmount)}
            </span>
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
          <Button type="submit" variant="primary" size="medium">
            Adicionar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
