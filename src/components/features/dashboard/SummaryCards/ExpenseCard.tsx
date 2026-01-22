import { useMemo } from 'react'
import { useFinance } from '../../../../contexts'
import { useAnimatedValue } from '../../../../hooks/useAnimatedValue'
import { formatCurrency } from '../../../../utils/formatCurrency'
import { Icon } from '../../../ui/Icon'
import { getCurrentMonthRange } from '../../../../utils/formatDate'

export function ExpenseCard() {
  const { calculateExpensesForPeriod, filters } = useFinance()

  // Calcular despesas do período atual (ou filtrado)
  const expenses = useMemo(() => {
    const startDate = filters.dateRange.startDate || getCurrentMonthRange().start
    const endDate = filters.dateRange.endDate || getCurrentMonthRange().end
    return calculateExpensesForPeriod(startDate, endDate)
  }, [calculateExpensesForPeriod, filters])

  // Animar valor
  const animatedValue = useAnimatedValue(expenses, 800)

  return (
    <div
      className="relative"
      style={{
        backgroundColor: 'var(--color-background-card)',
        borderRadius: 'var(--shape-radius-card)',
        padding: 'var(--space-padding-card)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border-card)',
        height: '240px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}
    >
      {/* Ícone no topo */}
      <div style={{ marginBottom: 'var(--space-32)' }}>
        <Icon name="arrow-down" size={24} color="var(--color-text-error)" />
      </div>

      {/* Label e Valor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Label */}
        <p
          style={{
            fontSize: 'var(--font-size-text-small)',
            lineHeight: 'var(--font-line-height-default)',
            letterSpacing: '0.3px',
            color: 'var(--color-text-primary)',
          }}
        >
          Despesas
        </p>

        {/* Valor */}
        <h2
          style={{
            fontSize: 'var(--font-size-value-large)',
            fontWeight: 'var(--font-weight-bold)',
            lineHeight: '36px',
            fontFeatureSettings: "'liga' off",
            color: 'var(--color-text-error)',
          }}
        >
          {formatCurrency(animatedValue)}
        </h2>
      </div>
    </div>
  )
}
