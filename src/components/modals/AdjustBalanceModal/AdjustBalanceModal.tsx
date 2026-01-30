import { useState, useEffect } from 'react'
import { useFinance } from '../../../contexts'
import { Modal } from '../../ui/Modal'
import { Icon } from '../../ui/Icon'
import { Button } from '../../ui/Button'
import { formatCurrency } from '../../../utils/formatCurrency'

export interface AdjustBalanceAccount {
  id: string
  name: string
  balance: number
}

interface AdjustBalanceModalProps {
  isOpen: boolean
  onClose: () => void
  account: AdjustBalanceAccount | null
}

export function AdjustBalanceModal({ isOpen, onClose, account }: AdjustBalanceModalProps) {
  const { updateAccount, refreshData } = useFinance()
  const [newBalance, setNewBalance] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (account && isOpen) {
      setNewBalance(formatCurrency(account.balance))
    }
  }, [account, isOpen])

  const formatAmountInput = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers === '') return ''
    const cents = parseInt(numbers, 10)
    return formatCurrency(cents / 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!account || !newBalance) return

    const balanceValue = parseFloat(newBalance.replace(/[^\d,]/g, '').replace(',', '.'))
    if (isNaN(balanceValue)) return

    setLoading(true)
    try {
      await updateAccount(account.id, { balance: balanceValue })
      await refreshData()
      setNewBalance('')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setNewBalance('')
    onClose()
  }

  if (!account) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Ajustar Saldo"
      subtitle={`Conta: ${account.name}. Saldo atual: ${formatCurrency(account.balance)}`}
      icon={<Icon name="wallet" size={20} color="var(--color-text-primary)" />}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 'var(--space-24)' }}>
          <label
            htmlFor="adjust-balance-input"
            style={{
              display: 'block',
              fontSize: 'var(--font-size-text-label)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-layout-element)',
              fontFeatureSettings: "'liga' off",
            }}
          >
            Novo saldo
          </label>
          <input
            id="adjust-balance-input"
            type="text"
            inputMode="decimal"
            value={newBalance}
            onChange={(e) => setNewBalance(formatAmountInput(e.target.value))}
            placeholder="R$ 0,00"
            required
            autoFocus
            style={{
              width: '100%',
              minHeight: '48px',
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
        <div
          className="flex gap-2"
          style={{
            justifyContent: 'flex-end',
            gap: 'var(--space-layout-component)',
          }}
        >
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Salvando…' : 'Confirmar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
