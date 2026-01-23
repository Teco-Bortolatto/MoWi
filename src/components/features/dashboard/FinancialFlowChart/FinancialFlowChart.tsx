import { useState, useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useFinance } from '../../../../contexts'
import { formatCurrency } from '../../../../utils/formatCurrency'
import { Icon } from '../../../ui/Icon'

type ViewMode = 'annual' | 'monthly'

interface MonthlyData {
  month: string
  receitas: number
  despesas: number
}

interface DailyData {
  day: string
  receitas: number
  despesas: number
}

/**
 * Formata valor para exibição compacta no eixo Y (R$ 2k, R$ 4k, etc)
 */
function formatCompactCurrency(value: number): string {
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}k`
  }
  return formatCurrency(value)
}

/**
 * Obtém o nome do mês em português
 */
function getMonthName(monthIndex: number): string {
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]
  return months[monthIndex]
}

/**
 * Componente de gráfico de fluxo financeiro
 */
export function FinancialFlowChart() {
  const { calculateIncomeForPeriod, calculateExpensesForPeriod } = useFinance()
  const [viewMode, setViewMode] = useState<ViewMode>('annual')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Dados anuais (12 meses)
  const annualData = useMemo<MonthlyData[]>(() => {
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEC']
    const currentYear = new Date().getFullYear()

    return months.map((month, index) => {
      const monthIndex = index + 1 // Janeiro = 1
      const startDate = new Date(currentYear, monthIndex - 1, 1)
      const endDate = new Date(currentYear, monthIndex, 0, 23, 59, 59, 999)

      const receitas = calculateIncomeForPeriod(startDate, endDate)
      const despesas = calculateExpensesForPeriod(startDate, endDate)

      return {
        month,
        receitas,
        despesas,
      }
    })
  }, [calculateIncomeForPeriod, calculateExpensesForPeriod])

  // Dados mensais (dias do mês selecionado)
  const monthlyData = useMemo<DailyData[]>(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    const data: DailyData[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const startDate = new Date(selectedYear, selectedMonth, day, 0, 0, 0, 0)
      const endDate = new Date(selectedYear, selectedMonth, day, 23, 59, 59, 999)

      const receitas = calculateIncomeForPeriod(startDate, endDate)
      const despesas = calculateExpensesForPeriod(startDate, endDate)

      data.push({
        day: day.toString().padStart(2, '0'),
        receitas,
        despesas,
      })
    }

    return data
  }, [selectedMonth, selectedYear, calculateIncomeForPeriod, calculateExpensesForPeriod])

  // Navegação de mês
  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  // Dados para o gráfico baseado no modo de visualização
  const chartData = viewMode === 'annual' ? annualData : monthlyData
  const dataKey = viewMode === 'annual' ? 'month' : 'day'

  // Formatação do eixo X
  const xAxisTicks = useMemo(() => {
    if (viewMode === 'annual') {
      return undefined // Recharts vai usar todos os meses
    } else {
      // Para mensal, mostrar apenas alguns dias: 1, 5, 10, 15, 20, 25, 30
      const days = monthlyData.length
      const tickDays = [1, 5, 10, 15, 20, 25, 30].filter((d) => d <= days)
      return tickDays.map((d) => d.toString().padStart(2, '0'))
    }
  }, [viewMode, monthlyData])

  // Tooltip customizado com backdrop-blur
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const receitasValue = payload.find((p: any) => p.dataKey === 'receitas')?.value || 0
      const despesasValue = payload.find((p: any) => p.dataKey === 'despesas')?.value || 0
      const gap = receitasValue - despesasValue

      return (
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: 'var(--space-padding-icon)',
            borderRadius: 'var(--shape-radius-icon)',
            boxShadow: 'var(--shadow-card-hover)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--color-border-default)',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          }}
        >
          <p
            style={{
              fontSize: 'var(--font-size-text-label)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-8)',
              fontFeatureSettings: "'liga' off",
            }}
          >
            {viewMode === 'annual' ? label : `Dia ${label}`}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p
              style={{
                fontSize: 'var(--font-size-text-small)',
                color: 'var(--color-text-success)',
                margin: 0,
                fontFeatureSettings: "'liga' off",
              }}
            >
              Receitas: {formatCurrency(receitasValue)}
            </p>
            <p
              style={{
                fontSize: 'var(--font-size-text-small)',
                color: 'var(--color-text-error)',
                margin: 0,
                fontFeatureSettings: "'liga' off",
              }}
            >
              Despesas: {formatCurrency(despesasValue)}
            </p>
            <p
              style={{
                fontSize: 'var(--font-size-text-small)',
                color: gap >= 0 ? 'var(--color-text-success)' : 'var(--color-text-error)',
                margin: 0,
                marginTop: 'var(--space-4)',
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--color-border-default)',
                fontWeight: 'var(--font-weight-semibold)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Saldo: {formatCurrency(gap)}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

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
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col"
        style={{
          marginBottom: 'var(--space-24)',
        }}
      >
        {/* Título com toggle */}
        <div
          className="flex items-center justify-between"
          style={{
            marginBottom: viewMode === 'monthly' ? 'var(--space-16)' : '0',
          }}
        >
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Icon name="chart" size={16} color="var(--color-text-primary)" />
            <h3
              style={{
                fontSize: 'var(--font-size-heading-widget)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Fluxo financeiro
            </h3>
          </div>

          {/* Toggle de visualização */}
          <div
            className="flex items-center"
            style={{
              gap: 'var(--space-4)',
              backgroundColor: 'var(--color-background-tertiary)',
              borderRadius: 'var(--shape-radius-button)',
              padding: '2px',
            }}
          >
            <button
              onClick={() => setViewMode('annual')}
              style={{
                padding: 'var(--space-8) var(--space-12)',
                borderRadius: 'var(--shape-radius-button)',
                fontSize: 'var(--font-size-text-label)',
                fontWeight: 'var(--font-weight-semibold)',
                color:
                  viewMode === 'annual'
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-secondary)',
                backgroundColor: viewMode === 'annual' ? 'var(--color-background-primary)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Anual
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              style={{
                padding: 'var(--space-8) var(--space-12)',
                borderRadius: 'var(--shape-radius-button)',
                fontSize: 'var(--font-size-text-label)',
                fontWeight: 'var(--font-weight-semibold)',
                color:
                  viewMode === 'monthly'
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-secondary)',
                backgroundColor: viewMode === 'monthly' ? 'var(--color-background-primary)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Mensal
            </button>
          </div>
        </div>

        {/* Navegação mensal */}
        {viewMode === 'monthly' && (
          <div
            className="flex items-center justify-center"
            style={{
              gap: 'var(--space-16)',
            }}
          >
            <button
              onClick={handlePreviousMonth}
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--shape-radius-button)',
                border: '1px solid var(--color-border-default)',
                backgroundColor: 'var(--color-background-primary)',
                cursor: 'pointer',
                color: 'var(--color-text-primary)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background-primary)'
              }}
            >
              <Icon name="chevron-left" size={16} color="var(--color-text-primary)" />
            </button>
            <span
              style={{
                fontSize: 'var(--font-size-heading-label)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                minWidth: '160px',
                textAlign: 'center',
                fontFeatureSettings: "'liga' off",
              }}
            >
              {getMonthName(selectedMonth)} {selectedYear}
            </span>
            <button
              onClick={handleNextMonth}
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--shape-radius-button)',
                border: '1px solid var(--color-border-default)',
                backgroundColor: 'var(--color-background-primary)',
                cursor: 'pointer',
                color: 'var(--color-text-primary)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background-primary)'
              }}
            >
              <Icon name="chevron-right" size={16} color="var(--color-text-primary)" />
            </button>
          </div>
        )}

        {/* Legenda */}
        <div
          className="flex items-center justify-end"
          style={{
            gap: 'var(--space-24)',
            marginTop: viewMode === 'monthly' ? 'var(--space-16)' : 'var(--space-16)',
          }}
        >
          {/* Receitas */}
          <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: 'var(--shape-100)',
                backgroundColor: 'var(--color-green-600)',
              }}
            />
            <span
              style={{
                fontSize: 'var(--font-size-label-medium)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-neutral-1000)',
                letterSpacing: '0.3px',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Receitas
            </span>
          </div>

          {/* Despesas */}
          <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: 'var(--shape-100)',
                backgroundColor: 'var(--color-red-600)',
              }}
            />
            <span
              style={{
                fontSize: 'var(--font-size-label-medium)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-neutral-1000)',
                letterSpacing: '0.3px',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Despesas
            </span>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {/* Gradiente para Receitas (verde) */}
              <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-green-600)" stopOpacity={0.1} />
                <stop offset="100%" stopColor="var(--color-green-600)" stopOpacity={0} />
              </linearGradient>
              {/* Gradiente para Despesas (vermelho) */}
              <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-red-600)" stopOpacity={0.1} />
                <stop offset="100%" stopColor="var(--color-red-600)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border-default)"
              vertical={false}
            />
            <XAxis
              dataKey={dataKey}
              axisLine={false}
              tickLine={false}
              ticks={xAxisTicks}
              tick={{
                fontSize: 'var(--font-size-label-medium)',
                fill: 'var(--color-text-secondary)',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCompactCurrency}
              tick={{
                fontSize: 'var(--font-size-label-medium)',
                fill: 'var(--color-text-secondary)',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Área de Despesas (vermelho) - renderizada primeiro para ficar atrás */}
            <Area
              type="monotone"
              dataKey="despesas"
              stroke="var(--color-red-600)"
              strokeWidth={3}
              fill="url(#colorDespesas)"
            />
            {/* Área de Receitas (verde) - renderizada por último para ficar em cima */}
            <Area
              type="monotone"
              dataKey="receitas"
              stroke="var(--color-green-600)"
              strokeWidth={3}
              fill="url(#colorReceitas)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
