import { useState, useMemo } from 'react'
import { useFinance } from '../../../../contexts'
import { formatCurrency } from '../../../../utils/formatCurrency'
import { Icon } from '../../../ui/Icon'
import { Button } from '../../../ui/Button'
import { NewTransactionModal } from '../../../modals/NewTransactionModal'

/**
 * Componente de widget de próximas despesas
 */
export function UpcomingExpensesWidget() {
  const { transactions, creditCards, bankAccounts, updateTransaction } = useFinance()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false)

  // Buscar despesas pendentes e ordenar por data de vencimento
  const upcomingExpenses = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    return transactions
      .filter((t) => t.type === 'expense' && !t.isPaid && t.status === 'pending')
      .filter((t) => {
        const dueDate = new Date(t.date)
        dueDate.setHours(0, 0, 0, 0)
        return dueDate >= now
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateA - dateB
      })
  }, [transactions])

  // Função para obter nome da conta/cartão
  const getAccountName = (accountId: string | null): string => {
    if (!accountId) return 'Desconhecido'

    // Buscar em bankAccounts
    const bankAccount = bankAccounts.find((acc) => acc.id === accountId)
    if (bankAccount) {
      return bankAccount.name
    }

    // Buscar em creditCards
    const creditCard = creditCards.find((card) => card.id === accountId)
    if (creditCard) {
      return `Crédito ${creditCard.name}${creditCard.lastDigits ? ` **** ${creditCard.lastDigits}` : ''}`
    }

    return 'Desconhecido'
  }

  // Função para marcar despesa como paga
  const handleMarkAsPaid = (transactionId: string, transaction: typeof transactions[0]) => {
    updateTransaction(transactionId, {
      isPaid: true,
      status: 'completed',
    })

    // Se for recorrente, criar próxima ocorrência
    if (transaction.isRecurring) {
      const nextDate = new Date(transaction.date)
      nextDate.setMonth(nextDate.getMonth() + 1)

      // Criar nova transação para o próximo mês
      // Isso seria feito através de addTransaction, mas por enquanto apenas atualizamos
    }

    // Se for parcelada, verificar próxima parcela
    if (transaction.installments > 1 && transaction.currentInstallment < transaction.installments) {
      const nextDate = new Date(transaction.date)
      nextDate.setMonth(nextDate.getMonth() + 1)

      // Criar próxima parcela
      // Isso seria feito através de addTransaction
    }
  }

  // Formatar data de vencimento
  const formatDueDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    return `Vence dia ${day}/${month}`
  }

  if (upcomingExpenses.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'var(--color-background-card)',
          borderRadius: 'var(--shape-radius-card)',
          padding: 'var(--space-padding-card)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--color-border-card)',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            marginBottom: 'var(--space-24)',
          }}
        >
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Icon name="wallet" size={20} color="var(--color-text-primary)" />
          <h3
            style={{
              fontSize: 'var(--font-size-heading-widget)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Próximas despesas
            </h3>
          </div>
          <Button
            onClick={() => setIsNewTransactionModalOpen(true)}
            variant="secondary"
            size="medium"
            icon="plus"
            iconOnly
            aria-label="Adicionar despesa"
          />
        </div>

        {/* Estado vazio */}
        <div
          className="flex flex-col items-center justify-center"
          style={{
            padding: 'var(--space-48)',
            borderWidth: '1px',
            borderStyle: 'dashed',
            borderColor: 'var(--color-border-default)',
            borderRadius: 'var(--shape-radius-icon)',
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--shape-radius-avatar)',
              backgroundColor: 'var(--color-background-success)',
              marginBottom: 'var(--space-16)',
            }}
          >
            <Icon name="check" size={24} color="var(--color-text-success)" />
          </div>
          <p
            style={{
              fontSize: 'var(--font-size-text-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Nenhuma despesa pendente
          </p>
        </div>

        {/* Modal Nova Transação */}
        <NewTransactionModal
          isOpen={isNewTransactionModalOpen}
          onClose={() => setIsNewTransactionModalOpen(false)}
          initialType="expense"
        />
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--color-neutral-0)',
        borderRadius: 'var(--shape-16)',
        padding: 'var(--space-24)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#D0D5DC',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          marginBottom: 'var(--space-24)',
        }}
      >
        <div className="flex items-center" style={{ gap: '8px' }}>
            <Icon name="wallet" size={20} color="var(--color-text-primary)" />
          <h3
            style={{
              fontSize: 'var(--font-size-heading-widget)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              fontFeatureSettings: "'liga' off",
            }}
          >
            Próximas despesas
          </h3>
        </div>
        <Button
          onClick={() => setIsNewTransactionModalOpen(true)}
          variant="secondary"
          size="medium"
          icon="plus"
          iconOnly
          aria-label="Adicionar despesa"
        />
      </div>

      {/* Lista de Despesas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {upcomingExpenses.map((expense, index) => (
          <div key={expense.id}>
            <div
              className="flex items-center justify-between"
              style={{
                paddingTop: 'var(--space-8)',
                paddingBottom: 'var(--space-8)',
              }}
            >
              {/* Lado esquerdo */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flex: 1 }}>
                <p
                  style={{
                    fontSize: 'var(--font-size-text-label)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '0.3px',
                    fontFeatureSettings: "'liga' off",
                  }}
                >
                  {expense.description}
                </p>
                <p
                  style={{
                    fontSize: 'var(--font-size-text-label)',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '0.3px',
                    fontFeatureSettings: "'liga' off",
                  }}
                >
                  {formatDueDate(expense.date)}
                </p>
                <p
                  style={{
                    fontSize: 'var(--font-size-text-caption)',
                    color: 'var(--color-text-secondary)',
                    letterSpacing: '0.3px',
                  }}
                >
                  {getAccountName(expense.accountId)}
                </p>
              </div>

              {/* Lado direito */}
              <div className="flex items-center" style={{ gap: 'var(--space-16)' }}>
                <p
                  style={{
                    fontSize: 'var(--font-size-value-medium)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '0.3px',
                    fontFeatureSettings: "'liga' off",
                  }}
                >
                  {formatCurrency(expense.amount)}
                </p>
                <button
                  onClick={() => handleMarkAsPaid(expense.id, expense)}
                  className="flex items-center justify-center focus:outline-none transition-all duration-200"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '78px',
                    backgroundColor: hoveredIndex === index ? 'var(--color-background-success)' : 'var(--color-background-surface)',
                    borderWidth: '0.75px',
                    borderStyle: 'solid',
                    borderColor: hoveredIndex === index ? 'var(--color-border-success)' : 'var(--color-border-card)',
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  aria-label="Marcar como pago"
                >
                  <Icon name="check" size={12} color={hoveredIndex === index ? 'var(--color-text-success)' : 'var(--color-text-secondary)'} />
                </button>
              </div>
            </div>
            {index < upcomingExpenses.length - 1 && (
              <div
                style={{
                  height: '1px',
                  backgroundColor: 'var(--color-border-card)',
                  marginTop: 'var(--space-8)',
                  marginBottom: 'var(--space-8)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Modal Nova Transação */}
      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
        initialType="expense"
      />
    </div>
  )
}
