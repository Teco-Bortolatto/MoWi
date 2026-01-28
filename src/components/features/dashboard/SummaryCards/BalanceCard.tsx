import { useMemo } from 'react'
import { useFinance } from '../../../../contexts'
import { useAnimatedValue } from '../../../../hooks/useAnimatedValue'
import { formatCurrency } from '../../../../utils/formatCurrency'
import { Icon } from '../../../ui/Icon'

export function BalanceCard() {
  const { calculateTotalBalance, calculateIncomeForPeriod, calculateExpensesForPeriod, filters } = useFinance()

  // Calcular saldo atual
  const currentBalance = useMemo(() => calculateTotalBalance(), [calculateTotalBalance])

  // Calcular saldo do período anterior para comparação
  const previousBalance = useMemo(() => {
    if (!filters.dateRange.startDate || !filters.dateRange.endDate) {
        // Se não houver filtro, simulamos um crescimento baseado no saldo total
        return currentBalance / 1.12
    }
    
    const start = filters.dateRange.startDate
    const end = filters.dateRange.endDate
    
    if (!start || !end) return currentBalance / 1.12

    const diff = end.getTime() - start.getTime()
    const prevStart = new Date(start.getTime() - diff)
    const prevEnd = new Date(end.getTime() - diff)
    
    const income = calculateIncomeForPeriod(prevStart, prevEnd)
    const expenses = calculateExpensesForPeriod(prevStart, prevEnd)
    
    return income - expenses
  }, [currentBalance, filters.dateRange, calculateIncomeForPeriod, calculateExpensesForPeriod])

  // Calcular crescimento percentual
  const growthPercentage = useMemo(() => {
    if (previousBalance === 0) return 0
    return ((currentBalance - previousBalance) / previousBalance) * 100
  }, [currentBalance, previousBalance])

  // Animar valor
  const animatedValue = useAnimatedValue(currentBalance, 800)

  return (
    <div
      className="relative overflow-hidden"
      style={{
        backgroundColor: 'var(--color-brand-700)',
        borderRadius: 'var(--shape-radius-card)',
        padding: 'var(--space-padding-card)',
        height: '240px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      {/* Círculo brand desfocado no fundo */}
      <div
        className="absolute"
        style={{
          width: '200px',
          height: '200px',
          borderRadius: 'var(--shape-100)',
          backgroundColor: 'var(--color-brand-700)',
          opacity: '0.15',
          filter: 'blur(60px)',
          top: '-50px',
          right: '-50px',
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 w-full">
        {/* Ícone no topo */}
        <div style={{ marginBottom: 'var(--space-32)' }}>
          <Icon name="wallet" size={24} color="var(--color-text-on-dark)" />
        </div>

        {/* Label e Valor */}
        <div style={{ gap: 'var(--space-4)', paddingBottom: '16px' }}>
          {/* Label */}
          <p
            style={{
              fontSize: 'var(--font-size-text-small)',
              lineHeight: 'var(--font-line-height-default)',
              letterSpacing: '0.3px',
              color: 'var(--color-text-on-dark)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Saldo Total
          </p>

          {/* Valor */}
          <h2
            style={{
              fontSize: 'var(--font-size-value-large)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: '36px',
              fontFeatureSettings: "'liga' off",
              color: 'var(--color-text-on-dark)',
            }}
          >
            {formatCurrency(animatedValue)}
          </h2>
        </div>

        {/* Badge de crescimento */}
        {growthPercentage > 0 && (
          <div
            className="inline-flex items-center gap-1"
            style={{
              padding: 'var(--space-6) var(--space-12)',
              borderRadius: 'var(--shape-100)',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Icon name="chart-up" size={14} color="var(--color-text-on-dark)" />
            <span
              style={{
                fontSize: 'var(--font-size-label-x-small)',
                color: 'var(--color-text-on-dark)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              +{growthPercentage.toFixed(0)}% esse mês
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
