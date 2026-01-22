import { useMemo } from 'react'
import { useFinance } from '../../../../contexts'
import { useAnimatedValue } from '../../../../hooks/useAnimatedValue'
import { formatCurrency } from '../../../../utils/formatCurrency'
import { Icon } from '../../../ui/Icon'
import { getCurrentMonthRange } from '../../../../utils/formatDate'

export function IncomeCard() {
  const { calculateIncomeForPeriod, filters } = useFinance()

  // Calcular receitas do período atual (ou filtrado)
  const income = useMemo(() => {
    const startDate = filters.dateRange.startDate || getCurrentMonthRange().start
    const endDate = filters.dateRange.endDate || getCurrentMonthRange().end
    return calculateIncomeForPeriod(startDate, endDate)
  }, [calculateIncomeForPeriod, filters])

  // Animar valor
  const animatedValue = useAnimatedValue(income, 800)

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
        <Icon name="arrow-up" size={24} color="var(--color-text-success)" />
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
          Receitas
        </p>

        {/* Valor */}
        <h2
          style={{
            fontSize: 'var(--font-size-value-large)',
            fontWeight: 'var(--font-weight-bold)',
            lineHeight: '36px',
            fontFeatureSettings: "'liga' off",
            color: 'var(--color-text-success)',
          }}
        >
          {formatCurrency(animatedValue)}
        </h2>
      </div>
    </div>
  )
}
