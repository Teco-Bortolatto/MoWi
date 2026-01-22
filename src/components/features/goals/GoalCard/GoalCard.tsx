import { useState, useEffect } from 'react'
import { Goal } from '../../../../types'
import { formatCurrency } from '../../../../utils/formatCurrency'
import { formatDateShort } from '../../../../utils/formatDate'
import { Icon } from '../../../ui/Icon'

interface GoalCardProps {
  goal: Goal
  onAddValue: (goalId: string) => void
  onEdit: (goalId: string) => void
}

// Mapeamento de categorias para emojis/ícones
const categoryIcons: Record<string, string> = {
  Viagem: '✈️',
  Reserva: '💰',
  Automóvel: '🚗',
  Educação: '📚',
  Casa: '🏠',
  Saúde: '🏥',
  Lazer: '🎮',
  Outros: '🎯',
}

export function GoalCard({ goal, onAddValue, onEdit }: GoalCardProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
  const progressPercentage = Math.min(Math.max(progress, 0), 100)

  // Animação da barra de progresso
  useEffect(() => {
    const duration = 800 // ms
    const startTime = Date.now()
    const startProgress = 0
    const endProgress = progressPercentage

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedProgress(startProgress + (endProgress - startProgress) * eased)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setAnimatedProgress(endProgress)
      }
    }

    requestAnimationFrame(animate)
  }, [progressPercentage])

  // Calcular quanto falta por mês
  const calculateMonthlyNeeded = () => {
    if (!goal.deadline) return null

    const now = new Date()
    const deadline = new Date(goal.deadline)
    
    // Calcular diferença em meses de forma mais precisa
    const yearsDiff = deadline.getFullYear() - now.getFullYear()
    const monthsDiff = deadline.getMonth() - now.getMonth()
    const daysDiff = deadline.getDate() - now.getDate()
    
    let totalMonths = yearsDiff * 12 + monthsDiff
    if (daysDiff < 0) {
      totalMonths -= 1
    }
    
    // Adicionar fração baseada nos dias restantes do mês atual
    const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const daysRemainingInMonth = daysInCurrentMonth - now.getDate()
    const fractionOfMonth = daysRemainingInMonth / daysInCurrentMonth
    
    const monthsRemaining = Math.max(totalMonths + fractionOfMonth, 0)

    if (monthsRemaining <= 0) return null

    const remaining = goal.targetAmount - goal.currentAmount
    if (remaining <= 0) return 0

    return remaining / monthsRemaining
  }

  const monthlyNeeded = calculateMonthlyNeeded()
  const icon = categoryIcons[goal.category] || categoryIcons.Outros

  return (
    <div
      style={{
        padding: 'var(--space-layout-component)',
        borderRadius: 'var(--shape-radius-card)',
        backgroundColor: 'var(--color-background-surface)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border-default)',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-hover)'
        e.currentTarget.style.boxShadow = 'var(--shadow-card-elevated)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-default)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      onClick={() => onEdit(goal.id)}
    >
      {/* Cabeçalho */}
      <div
        className="flex items-center"
        style={{
          gap: 'var(--space-layout-element)',
          marginBottom: 'var(--space-layout-component)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--shape-100)',
            backgroundColor: 'var(--color-background-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <h3
          style={{
            fontSize: 'var(--font-size-text-label)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
            fontFeatureSettings: "'liga' off",
            flex: 1,
            minWidth: 0,
          }}
        >
          {goal.title}
        </h3>
      </div>

      {/* Barra de Progresso */}
      <div style={{ marginBottom: 'var(--space-layout-component)' }}>
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: 'var(--space-gap-tight)' }}
        >
          <span
            style={{
              fontSize: 'var(--font-size-text-label)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              fontFeatureSettings: "'liga' off",
            }}
          >
            {animatedProgress.toFixed(0)}%
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            borderRadius: 'var(--shape-radius-icon)',
            backgroundColor: 'var(--color-background-tertiary)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${animatedProgress}%`,
              height: '100%',
              backgroundColor: 'var(--color-green-500)',
              borderRadius: 'var(--shape-radius-icon)',
              transition: 'width 0.3s ease-out',
            }}
          />
        </div>
      </div>

      {/* Valores */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 'var(--space-layout-component)' }}
      >
        <div>
          <p
            style={{
              fontSize: 'var(--font-size-text-body-medium)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)',
              fontFeatureSettings: "'liga' off",
            }}
          >
            {formatCurrency(goal.currentAmount)}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p
            style={{
              fontSize: 'var(--font-size-text-caption)',
              color: 'var(--color-text-secondary)',
            }}
          >
            de {formatCurrency(goal.targetAmount)}
          </p>
        </div>
      </div>

      {/* Rodapé */}
      <div
        className="flex items-center justify-between"
        style={{
          paddingTop: 'var(--space-layout-element)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'var(--color-border-default)',
        }}
      >
        {goal.deadline ? (
          <div className="flex items-center" style={{ gap: 'var(--space-gap-tight)' }}>
            <Icon name="calendar" size={14} color="var(--color-text-secondary)" />
            <span
              style={{
                fontSize: 'var(--font-size-text-caption)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {formatDateShort(goal.deadline)}
            </span>
          </div>
        ) : (
          <span
            style={{
              fontSize: 'var(--font-size-text-caption)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Sem prazo
          </span>
        )}

        {monthlyNeeded !== null && monthlyNeeded > 0 && (
          <span
            style={{
              fontSize: 'var(--font-size-text-caption)',
              color: 'var(--color-text-secondary)',
              textAlign: 'right',
            }}
          >
            {formatCurrency(monthlyNeeded)}/mês
          </span>
        )}
      </div>
    </div>
  )
}
