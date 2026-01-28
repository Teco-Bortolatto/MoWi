import { useState, useMemo } from 'react'
import { useFinance } from '../../../../contexts'
import { formatCurrency } from '../../../../utils/formatCurrency'
import { Icon } from '../../../ui/Icon'
import { Button } from '../../../ui/Button'
import { NewCardModal } from '../../../modals/NewCardModal'

/**
 * Componente de widget de cartões de crédito
 */
export function CreditCardsWidget() {
  const { accounts } = useFinance()
  const creditCards = useMemo(() => accounts.filter(acc => acc.type === 'CREDIT_CARD'), [accounts])
  const [currentPage, setCurrentPage] = useState(0)
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false)
  const itemsPerPage = 3

  const totalPages = Math.ceil(creditCards.length / itemsPerPage)
  const currentCards = creditCards.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  const getCardThemeStyles = (theme: 'black' | 'lime' | 'white') => {
    switch (theme) {
      case 'black':
        return {
          backgroundColor: 'var(--color-background-action-primary)',
          iconColor: 'rgba(255, 255, 255, 1)',
          badgeColor: 'var(--color-text-on-dark)',
          badgeTextColor: 'var(--color-background-action-primary)',
        }
      case 'lime':
        return {
          backgroundColor: 'var(--color-brand-400)',
          iconColor: 'var(--color-neutral-1000)',
          badgeColor: 'var(--color-neutral-1000)',
          badgeTextColor: 'var(--color-brand-400)',
        }
      case 'white':
        return {
          backgroundColor: 'var(--color-background-card)',
          iconColor: 'var(--color-text-primary)',
          badgeColor: 'var(--color-background-action-primary)',
          badgeTextColor: 'var(--color-text-on-dark)',
          borderColor: 'var(--color-border-card)',
        }
      default:
        return {
          backgroundColor: 'var(--color-background-action-primary)',
          iconColor: 'var(--color-text-on-dark)',
          badgeColor: 'var(--color-text-on-dark)',
          badgeTextColor: 'var(--color-background-action-primary)',
        }
    }
  }

  const calculateUsagePercentage = (currentBill: number, limit: number): number => {
    if (limit === 0) return 0
    return Math.round((currentBill / limit) * 100)
  }

  if (creditCards.length === 0) {
    return null
  }

  return (
    <div
      style={{
        background: 'unset',
        backgroundColor: 'unset',
        backgroundImage: 'none',
        borderRadius: '16px',
        paddingTop: 'var(--space-padding-card)',
        paddingBottom: 'var(--space-padding-card)',
        paddingLeft: '0px',
        paddingRight: '0px',
        width: '100%',
        borderWidth: '0px',
        borderStyle: 'none',
        borderColor: 'rgba(0, 0, 0, 0)',
        borderImage: 'none',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          marginBottom: 'var(--space-24)',
          paddingLeft: '16px',
          paddingRight: '16px',
          marginLeft: '8px',
        }}
      >
        <div className="flex items-center" style={{ gap: '16px' }}>
          <Icon name="credit-card" size={16} color="var(--color-text-primary)" />
          <h3
            style={{
              fontSize: 'var(--font-size-heading-widget)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              fontFeatureSettings: "'liga' off",
            }}
          >
            Cartões/contas
          </h3>
        </div>
        <Button
          onClick={() => setIsNewCardModalOpen(true)}
          variant="tertiary"
          size="small"
          icon="plus"
          iconOnly
          aria-label="Adicionar cartão"
        />
      </div>

      {/* Lista de Cartões */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {currentCards.map((card) => {
          const themeStyles = getCardThemeStyles(card.theme as 'black' | 'lime' | 'white')
          const limit = card.creditLimit || 0
          const usagePercentage = calculateUsagePercentage(card.currentBill, limit)

          return (
            <div
              key={card.id}
              className="flex items-center"
              style={{
                backgroundColor: 'var(--color-background-card)',
                borderRadius: 'var(--shape-radius-card)',
                paddingTop: 'var(--space-padding-icon)',
                paddingRight: '24px',
                paddingBottom: 'var(--space-padding-icon)',
                paddingLeft: '24px',
                gap: '16px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                borderWidth: '0px',
                borderStyle: 'none',
                borderColor: 'rgba(0, 0, 0, 0)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Ícone à esquerda */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: 'var(--shape-8)',
                  backgroundColor: 'var(--color-background-action-primary)',
                  borderWidth: card.theme === 'white' ? '1px' : '0',
                  borderStyle: card.theme === 'white' ? 'solid' : 'none',
                  borderColor: themeStyles.borderColor || 'transparent',
                  color: 'rgba(247, 247, 248, 1)',
                }}
              >
                <Icon name="credit-card" size={16} color="rgba(255, 255, 255, 1)" />
              </div>

              {/* Informações ao centro */}
              <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <p
                  style={{
                    fontSize: 'var(--font-size-text-body)',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '0.3px',
                  }}
                >
                  {card.name}
                </p>
                <p
                  style={{
                    fontSize: 'var(--font-size-value-large)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-primary)',
                    fontFeatureSettings: "'liga' off",
                  }}
                >
                  {formatCurrency(card.currentBill)}
                </p>
                {card.lastDigits && (
                  <p
                    style={{
                      fontSize: 'var(--font-size-text-small)',
                      color: 'var(--color-text-secondary)',
                      letterSpacing: '0.3px',
                    }}
                  >
                    •••• {card.lastDigits}
                  </p>
                )}
              </div>

              {/* Badge de uso à direita */}
              <div
                className="flex items-center justify-center"
                style={{
                  minWidth: '48px',
                  height: '24px',
                  borderRadius: 'var(--shape-radius-badge)',
                  backgroundColor: themeStyles.badgeColor,
                  paddingLeft: 'var(--space-8)',
                  paddingRight: 'var(--space-8)',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--font-size-text-label)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-action-primary)',
                    fontFeatureSettings: "'liga' off",
                  }}
                >
                  {usagePercentage}%
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-center"
          style={{
            marginTop: 'var(--space-16)',
            gap: 'var(--space-8)',
          }}
        >
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            variant="tertiary"
            size="small"
            icon="chevron-left"
            iconOnly
            aria-label="Página anterior"
          />
          <span
            style={{
              fontSize: 'var(--font-size-text-label)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            variant="tertiary"
            size="small"
            icon="chevron-right"
            iconOnly
            aria-label="Próxima página"
          />
        </div>
      )}

      {/* Modal Novo Cartão */}
      <NewCardModal
        isOpen={isNewCardModalOpen}
        onClose={() => setIsNewCardModalOpen(false)}
      />
    </div>
  )
}
