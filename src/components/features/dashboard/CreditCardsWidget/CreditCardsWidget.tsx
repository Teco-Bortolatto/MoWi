import { useState, useMemo } from 'react'
import { useFinance } from '../../../../contexts'
import { formatCurrency } from '../../../../utils/formatCurrency'
import { Icon } from '../../../ui/Icon'
import { Button } from '../../../ui/Button'
import { NewCardModal } from '../../../modals/NewCardModal'

/**
 * Widget de Cartões e Contas: cartões de crédito + contas (corrente/poupança)
 */
export function CreditCardsWidget() {
  const { accounts, filters } = useFinance()
  const displayItems = useMemo(() => {
    let list = accounts.filter(
      (acc) =>
        acc.type === 'CREDIT_CARD' ||
        acc.type === 'CHECKING' ||
        acc.type === 'SAVINGS'
    )
    if (filters.selectedMember) {
      list = list.filter((acc) => acc.holderId === filters.selectedMember)
    }
    return list
  }, [accounts, filters.selectedMember])
  const [currentPage, setCurrentPage] = useState(0)
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false)
  const itemsPerPage = 3

  const totalPages = Math.ceil(displayItems.length / itemsPerPage)
  const currentItems = displayItems.slice(
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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-background-card)',
        borderRadius: 'var(--shape-radius-card)',
        padding: 'var(--space-padding-card)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border-card)',
        width: '100%',
        height: '100%',
        minHeight: 0,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          marginBottom: 'var(--space-24)',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--space-8)' }}>
          <Icon name="credit-card" size={20} color="var(--color-text-primary)" />
          <h3
            style={{
              fontSize: 'var(--font-size-heading-widget)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              fontFeatureSettings: "'liga' off",
            }}
          >
            Cartões e Contas
          </h3>
        </div>
        <Button
          onClick={() => setIsNewCardModalOpen(true)}
          variant="secondary"
          size="medium"
          icon="plus"
          iconOnly
          aria-label="Adicionar cartão"
        />
      </div>

      {displayItems.length === 0 ? (
        /* Estado vazio */
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
              backgroundColor: 'var(--color-background-tertiary)',
              marginBottom: 'var(--space-16)',
            }}
          >
            <Icon name="credit-card" size={24} color="var(--color-text-tertiary)" />
          </div>
          <p
            style={{
              fontSize: 'var(--font-size-text-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Nenhum cartão ou conta registrado
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* Lista de Cartões e Contas */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {currentItems.map((item) => {
            if (item.type === 'CREDIT_CARD') {
              const themeStyles = getCardThemeStyles(item.theme as 'black' | 'lime' | 'white')
              const limit = item.creditLimit || 0
              const usagePercentage = calculateUsagePercentage(item.currentBill, limit)
              return (
                <div
                  key={item.id}
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
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: 'var(--shape-8)',
                      backgroundColor: 'var(--color-background-action-primary)',
                      borderWidth: item.theme === 'white' ? '1px' : '0',
                      borderStyle: item.theme === 'white' ? 'solid' : 'none',
                      borderColor: themeStyles.borderColor || 'transparent',
                    }}
                  >
                    <Icon name="credit-card" size={16} color="rgba(255, 255, 255, 1)" />
                  </div>
                  <div className="flex-1 min-w-0" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ fontSize: 'var(--font-size-text-body)', color: 'var(--color-text-primary)', letterSpacing: '0.3px' }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-value-large)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', fontFeatureSettings: "'liga' off" }}>
                      {formatCurrency(item.currentBill)}
                    </p>
                    {item.lastDigits && (
                      <p style={{ fontSize: 'var(--font-size-text-small)', color: 'var(--color-text-secondary)', letterSpacing: '0.3px' }}>
                        •••• {item.lastDigits}
                      </p>
                    )}
                  </div>
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
                    <span style={{ fontSize: 'var(--font-size-text-label)', fontWeight: 'var(--font-weight-bold)', color: themeStyles.badgeTextColor, fontFeatureSettings: "'liga' off" }}>
                      {usagePercentage}%
                    </span>
                  </div>
                </div>
              )
            }
            return (
              <div
                key={item.id}
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
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: 'var(--shape-8)',
                    backgroundColor: 'var(--color-background-tertiary)',
                  }}
                >
                  <Icon name="wallet" size={16} color="var(--color-text-secondary)" />
                </div>
                <div className="flex-1 min-w-0" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <p style={{ fontSize: 'var(--font-size-text-body)', color: 'var(--color-text-primary)', letterSpacing: '0.3px' }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize: 'var(--font-size-value-large)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', fontFeatureSettings: "'liga' off" }}>
                    {formatCurrency(item.balance)}
                  </p>
                  {item.lastDigits && (
                    <p style={{ fontSize: 'var(--font-size-text-small)', color: 'var(--color-text-secondary)', letterSpacing: '0.3px' }}>
                      •••• {item.lastDigits}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
          </div>

          {/* Paginação - colada na borda inferior do card */}
          {totalPages > 1 && (
        <div
          className="flex items-center justify-center"
          style={{
            marginTop: 'auto',
            paddingTop: 'var(--space-16)',
            gap: 'var(--space-8)',
            flexShrink: 0,
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
