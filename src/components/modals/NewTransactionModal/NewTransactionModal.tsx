import { useState, useEffect } from 'react'
import { useFinance } from '../../../contexts'
import { Modal } from '../../ui/Modal'
import { Icon } from '../../ui/Icon'
import { Button } from '../../ui/Button'
import { formatCurrency } from '../../../utils/formatCurrency'
import { categoryService, Category } from '../../../services/categoryService'

interface NewTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  initialType?: 'INCOME' | 'EXPENSE'
  initialAccountId?: string | null
}

/**
 * Modal para criar nova transação
 */
export function NewTransactionModal({
  isOpen,
  onClose,
  initialType = 'EXPENSE',
  initialAccountId = null,
}: NewTransactionModalProps) {
  const { addTransaction, familyMembers, accounts } = useFinance()

  const [transactionType, setTransactionType] = useState<'INCOME' | 'EXPENSE'>(initialType)
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date())
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [memberId, setMemberId] = useState<string | null>(null)
  const [accountId, setAccountId] = useState<string | null>(initialAccountId)
  const [installments, setInstallments] = useState(1)
  const [isRecurring, setIsRecurring] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)

  // Carregar categorias reais do Supabase
  const loadCategories = async () => {
    setLoadingCategories(true)
    try {
      const data = await categoryService.getAll(transactionType)
      setCategories(data)
      if (data.length > 0 && !categoryId) setCategoryId(data[0].id)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadCategories()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load on open/type change only
  }, [isOpen, transactionType])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !description || !categoryId) {
      return
    }

    const amountValue = parseFloat(amount.replace(/[^\d,]/g, '').replace(',', '.'))

    if (isNaN(amountValue) || amountValue <= 0) {
      return
    }

    addTransaction({
      type: transactionType,
      amount: amountValue,
      description,
      categoryId,
      date,
      accountId,
      memberId,
      totalInstallments: installments,
      status: 'COMPLETED',
      isRecurring,
    })

    // Reset form
    setAmount('')
    setDescription('')
    setCategoryId('')
    setDate(new Date())
    setMemberId(null)
    setAccountId(initialAccountId)
    setInstallments(1)
    setIsRecurring(false)

    onClose()
  }

  const formatAmountInput = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers === '') return ''
    const cents = parseInt(numbers, 10)
    return formatCurrency(cents / 100)
  }

  const bankAccounts = accounts.filter(acc => acc.type !== 'CREDIT_CARD')
  const creditCards = accounts.filter(acc => acc.type === 'CREDIT_CARD')

  const allAccounts = [
    ...bankAccounts.map((acc) => ({ id: acc.id, name: acc.name, type: 'account' as const })),
    ...creditCards.map((card) => ({ id: card.id, name: card.name, type: 'card' as const })),
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova transação"
      subtitle="Registre entradas e saídas para manter seu controle."
      icon={<Icon name="arrow-up" size={20} color="var(--color-text-primary)" />}
    >
      <form onSubmit={handleSubmit}>
        {/* Tipo de transação */}
        <div
          className="flex"
          style={{
            marginBottom: 'var(--space-margin-section)',
            gap: '0',
            borderRadius: 'var(--shape-radius-icon)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--color-border-default)',
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
            onClick={() => setTransactionType('INCOME')}
            style={{
              flex: 1,
              padding: 'var(--space-padding-button-small)',
              backgroundColor: transactionType === 'INCOME' ? 'var(--color-background-action-primary)' : 'var(--color-background-surface)',
              color: transactionType === 'INCOME' ? 'var(--color-text-on-action-primary)' : 'var(--color-text-primary)',
              fontSize: 'var(--font-size-text-label)',
              fontWeight: 'var(--font-weight-bold)',
              border: 'none',
              cursor: 'pointer',
              fontFeatureSettings: "'liga' off",
            }}
          >
            Receita
          </button>
          <button
            type="button"
            onClick={() => setTransactionType('EXPENSE')}
            style={{
              flex: 1,
              padding: 'var(--space-padding-button-small)',
              backgroundColor: transactionType === 'EXPENSE' ? 'var(--color-background-action-primary)' : 'var(--color-background-surface)',
              color: transactionType === 'EXPENSE' ? 'var(--color-text-on-action-primary)' : 'var(--color-text-primary)',
              fontSize: 'var(--font-size-text-label)',
              fontWeight: 'var(--font-weight-bold)',
              border: 'none',
              cursor: 'pointer',
              fontFeatureSettings: "'liga' off",
            }}
          >
            Despesas
          </button>
        </div>

        {/* Campos do formulário */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: 'var(--space-layout-component)', alignItems: 'center' }}
        >
          {/* Valor */}
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
              Valor da transação
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

          {/* Data */}
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
              Data
            </label>
            <div className="relative">
              <input
                type="date"
                className="hide-native-date-icon"
                value={date.toISOString().split('T')[0]}
                onChange={(e) => setDate(new Date(e.target.value))}
                required
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
                }}
              />
              <div
                className="absolute pointer-events-none"
                style={{ right: 'var(--space-12)', top: '50%', transform: 'translateY(-50%)' }}
              >
                <Icon name="calendar" size={16} color="var(--color-text-secondary)" />
              </div>
            </div>
          </div>

          {/* Descrição */}
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
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="EX: Supermercado Semanal"
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
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                disabled={loadingCategories}
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
                {loadingCategories ? (
                  <option>Carregando...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))
                )}
              </select>
              <div
                className="absolute pointer-events-none"
                style={{ right: 'var(--space-12)', top: '50%', transform: 'translateY(-50%)' }}
              >
                <Icon name="chevron-down" size={16} color="var(--color-text-secondary)" />
              </div>
            </div>
          </div>

          {/* Responsável */}
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
                value={memberId || ''}
                onChange={(e) => setMemberId(e.target.value || null)}
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
                <option value="">Familiar</option>
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

          {/* Conta/Cartão */}
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
              Conta / cartão
            </label>
            <div className="relative">
              <select
                value={accountId || ''}
                onChange={(e) => setAccountId(e.target.value || null)}
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
                <option value="">Selecione</option>
                {allAccounts.map((acc: { id: string; name: string; type: 'account' | 'card' }) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
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

          {/* Parcelas */}
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
              Parcelas
            </label>
            <div className="relative">
              <select
                value={installments}
                onChange={(e) => setInstallments(parseInt(e.target.value, 10))}
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
                {[1, 2, 3, 4, 5, 6, 10, 12].map((num) => (
                  <option key={num} value={num}>
                    {num === 1 ? 'À vista (1x)' : `${num}x`}
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

        {/* Despesa recorrente */}
        {transactionType === 'EXPENSE' && (
          <div style={{ marginTop: 'var(--space-layout-component)' }}>
            <label
              className="flex items-start"
              style={{ gap: 'var(--space-layout-element)', cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  marginTop: 'var(--space-gap-tight)',
                }}
              />
              <div>
                <span
                  style={{
                    fontSize: 'var(--font-size-text-label)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-primary)',
                    fontFeatureSettings: "'liga' off",
                  }}
                >
                  Despesa recorrente
                </span>
                <p
                  style={{
                    fontSize: 'var(--font-size-text-caption)',
                    color: 'var(--color-text-secondary)',
                    marginTop: 'var(--space-gap-tight)',
                  }}
                >
                  Contas que se repetem todo mês (Netflix, Spotify, Academia, etc).
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Botões */}
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
            Salvar transação
          </Button>
        </div>
      </form>
    </Modal>
  )
}
