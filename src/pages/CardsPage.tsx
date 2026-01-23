import { useState, useMemo } from 'react'
import { useFinance } from '../contexts'
import { formatCurrency } from '../utils/formatCurrency'
import { Icon } from '../components/ui/Icon'
import { Button } from '../components/ui/Button'
import { NewCardModal } from '../components/modals/NewCardModal/NewCardModal'
import { NewTransactionModal } from '../components/modals/NewTransactionModal'

function CardsPage() {
  const { creditCards } = useFinance()
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false)
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

  // Ordenar cartões por fatura decrescente
  const sortedCards = useMemo(() => {
    return [...creditCards].sort((a, b) => b.currentBill - a.currentBill)
  }, [creditCards])

  const handleAddExpense = (cardId: string) => {
    setSelectedCardId(cardId)
    setIsNewTransactionModalOpen(true)
  }

  // Todos os cards seguem o padrão do XP (branco) para consistência
  const getCardThemeStyles = () => {
    return {
      borderColor: 'var(--color-border-card)',
      backgroundColor: 'var(--color-background-card)',
      textColor: 'var(--color-text-primary)',
    }
  }

  const calculateUsagePercentage = (currentBill: number, limit: number): number => {
    if (limit === 0) return 0
    return Math.round((currentBill / limit) * 100)
  }

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: 'var(--color-background-dashboard)' }}>
      <div
        className="w-full lg:pt-[var(--space-layout-section)]"
        style={{
          paddingTop: 'calc(var(--space-layout-section) + var(--space-header-height))',
          paddingBottom: 'var(--space-layout-section)',
        }}
      >
        {/* Header */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between"
          style={{
            marginBottom: 'var(--space-layout-container)',
            gap: 'var(--space-layout-component)',
          }}
        >
          <h1
            style={{
              fontSize: 'var(--font-size-heading-section)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              fontFeatureSettings: "'liga' off",
            }}
          >
            Cartões de Crédito
          </h1>
          <Button
            onClick={() => setIsNewCardModalOpen(true)}
            variant="primary"
            size="medium"
            icon="plus"
          >
            Novo Cartão
          </Button>
        </div>

        {/* Grid de Cartões */}
        {sortedCards.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center"
            style={{
              padding: 'var(--space-64)',
              backgroundColor: 'var(--color-background-card)',
              borderRadius: 'var(--shape-radius-card)',
              borderWidth: '1px',
              borderStyle: 'dashed',
              borderColor: 'var(--color-border-default)',
            }}
          >
            <Icon name="credit-card" size={64} color="var(--color-text-disabled)" />
            <h3
              style={{
                fontSize: 'var(--font-size-heading-card)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginTop: 'var(--space-layout-section)',
                marginBottom: 'var(--space-layout-component)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Nenhum cartão cadastrado
            </h3>
            <button
              onClick={() => setIsNewCardModalOpen(true)}
              style={{
                padding: 'var(--space-padding-button-medium)',
                borderRadius: 'var(--shape-radius-button)',
                backgroundColor: 'var(--color-background-action-primary)',
                color: 'var(--color-text-on-action-primary)',
                fontSize: 'var(--font-size-button-medium)',
                fontWeight: 'var(--font-weight-bold)',
                cursor: 'pointer',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Cadastrar Primeiro Cartão
            </button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            style={{ gap: 'var(--space-layout-section)' }}
          >
            {sortedCards.map((card) => {
              const themeStyles = getCardThemeStyles()
              const usagePercentage = calculateUsagePercentage(card.currentBill, card.limit)
              const availableLimit = card.limit - card.currentBill

              return (
                <div
                  key={card.id}
                  className="flex flex-col"
                  style={{
                    backgroundColor: themeStyles.backgroundColor,
                    borderRadius: 'var(--shape-radius-card)',
                    padding: 'var(--space-layout-card)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: themeStyles.borderColor,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = `0 var(--shadow-offset-y-down-4) var(--shadow-blur-8) var(--shadow-spread-0) var(--shadow-color-neutral-8)`
                    e.currentTarget.style.borderColor = 'var(--color-border-card-hover)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = themeStyles.borderColor
                  }}
                >
                  {/* Nome do cartão */}
                  <div
                    className="flex items-center justify-between"
                    style={{ marginBottom: 'var(--space-layout-section)' }}
                  >
                    <h3
                      style={{
                        fontSize: 'var(--font-size-heading-card)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: themeStyles.textColor,
                        fontFeatureSettings: "'liga' off",
                      }}
                    >
                      {card.name}
                    </h3>
                  </div>

                  {/* Valores */}
                  <div style={{ marginBottom: 'var(--space-layout-section)', display: 'flex', flexDirection: 'column', gap: 'var(--space-gap-component)' }}>
                    <div className="flex justify-between">
                      <span style={{ fontSize: 'var(--font-size-text-body-small)', color: 'var(--color-text-secondary)' }}>
                        Limite total
                      </span>
                      <span style={{ fontSize: 'var(--font-size-text-body-small)', fontWeight: 'var(--font-weight-bold)', color: themeStyles.textColor }}>
                        {formatCurrency(card.limit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ fontSize: 'var(--font-size-text-body-small)', color: 'var(--color-text-secondary)' }}>
                        Fatura atual
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--font-size-heading-card)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: usagePercentage > 80 ? 'var(--color-text-error)' : themeStyles.textColor,
                          fontFeatureSettings: "'liga' off",
                        }}
                      >
                        {formatCurrency(card.currentBill)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ fontSize: 'var(--font-size-text-body-small)', color: 'var(--color-text-secondary)' }}>
                        Limite disponível
                      </span>
                      <span style={{ fontSize: 'var(--font-size-text-body-small)', fontWeight: 'var(--font-weight-bold)', color: themeStyles.textColor }}>
                        {formatCurrency(availableLimit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ fontSize: 'var(--font-size-text-body-small)', color: 'var(--color-text-secondary)' }}>
                        Uso
                      </span>
                      <span style={{ fontSize: 'var(--font-size-text-body-small)', fontWeight: 'var(--font-weight-bold)', color: themeStyles.textColor }}>
                        {usagePercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Barra de progresso */}
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: 'var(--color-background-tertiary)',
                      borderRadius: 'var(--shape-100)',
                      marginBottom: 'var(--space-layout-section)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${usagePercentage}%`,
                        height: '100%',
                        backgroundColor: usagePercentage > 80 ? 'var(--color-text-error)' : 'var(--color-brand-500)',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>

                  {/* Datas */}
                  <div style={{ marginBottom: 'var(--space-layout-section)', display: 'flex', flexDirection: 'column', gap: 'var(--space-layout-element)' }}>
                    <div className="flex items-center" style={{ gap: 'var(--space-layout-element)' }}>
                      <Icon name="calendar" size={16} color="var(--color-text-secondary)" />
                      <span style={{ fontSize: 'var(--font-size-text-body-small)', color: 'var(--color-text-secondary)' }}>
                        Fecha dia {card.closingDay.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex items-center" style={{ gap: 'var(--space-layout-element)' }}>
                      <Icon name="calendar" size={16} color="var(--color-text-secondary)" />
                      <span style={{ fontSize: 'var(--font-size-text-body-small)', color: 'var(--color-text-secondary)' }}>
                        Vence dia {card.dueDay.toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Últimos dígitos */}
                  {card.lastDigits && (
                    <div style={{ marginBottom: 'var(--space-layout-section)' }}>
                      <span
                        style={{
                          fontSize: 'var(--font-size-text-body-small)',
                          color: 'var(--color-text-secondary)',
                          fontFamily: 'monospace',
                        }}
                      >
                        •••• {card.lastDigits}
                      </span>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex gap-2" style={{ marginTop: 'auto' }}>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddExpense(card.id)
                      }}
                      variant="secondary"
                      size="small"
                      fullWidth
                    >
                      Adicionar Despesa
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modais */}
      <NewCardModal
        isOpen={isNewCardModalOpen}
        onClose={() => setIsNewCardModalOpen(false)}
      />
      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => {
          setIsNewTransactionModalOpen(false)
          setSelectedCardId(null)
        }}
        initialAccountId={selectedCardId}
      />
    </div>
  )
}

export default CardsPage
