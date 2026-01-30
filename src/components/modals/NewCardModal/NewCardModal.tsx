import { useState } from 'react'
import { useFinance } from '../../../contexts'
import { Modal } from '../../ui/Modal'
import { Icon } from '../../ui/Icon'
import { Button } from '../../ui/Button'
import { formatCurrency } from '../../../utils/formatCurrency'

interface NewCardModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewCardModal({ isOpen, onClose }: NewCardModalProps) {
  const { addAccount, familyMembers } = useFinance()

  const [type, setType] = useState<'CHECKING' | 'SAVINGS' | 'CREDIT_CARD'>('CREDIT_CARD')
  const [name, setName] = useState('')
  const [bank, setBank] = useState('')
  const [holderId, setHolderId] = useState<string | null>(null)
  const [closingDay, setClosingDay] = useState(1)
  const [dueDay, setDueDay] = useState(1)
  const [limit, setLimit] = useState('')
  const [balance, setBalance] = useState('')
  const [lastDigits, setLastDigits] = useState('')
  const [theme, setTheme] = useState<'black' | 'lime' | 'white'>('black')
  const [tabHovered, setTabHovered] = useState<'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !bank) return

    const limitValue = parseFloat(limit.replace(/[^\d,]/g, '').replace(',', '.'))
    const balanceValue = parseFloat(balance.replace(/[^\d,]/g, '').replace(',', '.'))

    await addAccount({
      type,
      name,
      bank,
      holderId: holderId || familyMembers[0]?.id || '',
      closingDay: type === 'CREDIT_CARD' ? closingDay : null,
      dueDay: type === 'CREDIT_CARD' ? dueDay : null,
      creditLimit: type === 'CREDIT_CARD' ? (isNaN(limitValue) ? 0 : limitValue) : null,
      balance: type !== 'CREDIT_CARD' ? (isNaN(balanceValue) ? 0 : balanceValue) : 0,
      currentBill: 0,
      theme: type === 'CREDIT_CARD' ? theme : null,
      lastDigits: lastDigits || null,
    })

    // Reset
    setName('')
    setBank('')
    setHolderId(null)
    setClosingDay(1)
    setDueDay(1)
    setLimit('')
    setBalance('')
    setLastDigits('')
    setTheme('black')

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
      title="Nova Conta ou Cartão"
      subtitle="Adicione uma nova conta bancária ou cartão de crédito."
      icon={<Icon name="credit-card" size={20} color="var(--color-text-primary)" />}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-layout-component)' }}>
          {/* Tipo: seleção Corrente / Poupança / Cartão — estados explícitos e WCAG */}
          <div
            className="flex gap-2 p-1 rounded-xl"
            style={{ backgroundColor: 'var(--color-background-secondary)' }}
          >
            {(['CREDIT_CARD', 'CHECKING', 'SAVINGS'] as const).map((t) => {
              const isSelected = type === t
              const isUnselectedHover = !isSelected && tabHovered === t
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  onMouseEnter={() => setTabHovered(t)}
                  onMouseLeave={() => setTabHovered(null)}
                  className="flex-1 py-2 text-xs font-bold rounded-lg transition-all shadow-sm min-h-[44px]"
                  style={{
                    backgroundColor: isSelected
                      ? 'var(--color-background-action-primary)'
                      : 'transparent',
                    color: isSelected
                      ? 'var(--color-text-on-action-primary)'
                      : isUnselectedHover
                        ? 'var(--color-text-primary)'
                        : 'var(--color-text-secondary)',
                  }}
                  aria-pressed={isSelected}
                  aria-label={
                    t === 'CHECKING'
                      ? 'Conta corrente'
                      : t === 'SAVINGS'
                        ? 'Poupança'
                        : 'Cartão de crédito'
                  }
                >
                  {t === 'CHECKING' ? 'Corrente' : t === 'SAVINGS' ? 'Poupança' : 'Cartão'}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-2 gap-16">
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
                Nome/Apelido
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Nubank"
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
                Instituição/Banco
              </label>
              <input
                type="text"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                placeholder="Ex: Itaú"
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
          </div>

          {type === 'CREDIT_CARD' ? (
            <>
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
                  Limite total
                </label>
                <input
                  type="text"
                  value={limit}
                  onChange={(e) => setLimit(formatAmountInput(e.target.value))}
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
                    Fechamento
                  </label>
                  <div className="relative">
                    <select
                      value={closingDay}
                      onChange={(e) => setClosingDay(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        height: 'var(--size-input-height-small)',
                        padding: 'var(--space-padding-button-small)',
                        paddingRight: 'calc(var(--space-12) + 16px)',
                        borderRadius: 'var(--shape-radius-input)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: 'var(--color-border-input-default)',
                        fontSize: 'var(--font-size-input-small)',
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-background-input-default)',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                      }}
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>
                          Dia {day}
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
                    Vencimento
                  </label>
                  <div className="relative">
                    <select
                      value={dueDay}
                      onChange={(e) => setDueDay(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        height: 'var(--size-input-height-small)',
                        padding: 'var(--space-padding-button-small)',
                        paddingRight: 'calc(var(--space-12) + 16px)',
                        borderRadius: 'var(--shape-radius-input)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: 'var(--color-border-input-default)',
                        fontSize: 'var(--font-size-input-small)',
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-background-input-default)',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                      }}
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>
                          Dia {day}
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
            </>
          ) : (
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
                Saldo Inicial
              </label>
              <input
                type="text"
                value={balance}
                onChange={(e) => setBalance(formatAmountInput(e.target.value))}
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
          )}

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
              Responsável
            </label>
            <div className="relative">
              <select
                value={holderId || ''}
                onChange={(e) => setHolderId(e.target.value || null)}
                style={{
                  width: '100%',
                  height: 'var(--size-input-height-small)',
                  padding: 'var(--space-padding-button-small)',
                  paddingRight: 'calc(var(--space-12) + 16px)',
                  borderRadius: 'var(--shape-radius-input)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--color-border-input-default)',
                  fontSize: 'var(--font-size-input-small)',
                  color: 'var(--color-text-primary)',
                  backgroundColor: 'var(--color-background-input-default)',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              >
                {familyMembers.map((member: { id: string; name: string }) => (
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
              Cor de identificação
            </label>
            <div className="flex gap-2">
              {(['black', 'lime', 'white'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--shape-radius-avatar)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: theme === t ? 'var(--color-border-button-primary)' : 'var(--color-border-default)',
                    backgroundColor:
                      t === 'black'
                        ? 'var(--color-background-action-primary)'
                        : t === 'lime'
                        ? 'var(--color-brand-400)'
                        : 'var(--color-background-surface)',
                    cursor: 'pointer',
                  }}
                />
              ))}
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
