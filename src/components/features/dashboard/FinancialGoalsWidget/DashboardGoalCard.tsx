import { Goal } from '../../../../types'
import { formatCurrency } from '../../../../utils/formatCurrency'
import { formatDateShort } from '../../../../utils/formatDate'
import { Icon } from '../../../ui/Icon'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../../constants'

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

const CARD_WIDTH = 260

interface DashboardGoalCardProps {
  goal: Goal
}

/**
 * Card compacto de objetivo para o carrossel do dashboard
 */
export function DashboardGoalCard({ goal }: DashboardGoalCardProps) {
  const progress =
    goal.targetAmount > 0
      ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
      : 0
  const icon = categoryIcons[goal.category ?? 'Outros'] ?? categoryIcons.Outros

  return (
    <Link
      to={ROUTES.GOALS}
      style={{
        flexShrink: 0,
        width: CARD_WIDTH,
        textDecoration: 'none',
        color: 'inherit',
      }}
      aria-label={`Objetivo ${goal.title}, ${progress.toFixed(0)}% concluído`}
    >
      <div
        className="flex flex-col"
        style={{
          padding: 'var(--space-padding-card)',
          backgroundColor: 'var(--color-background-card)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--color-border-card)',
          borderRadius: 'var(--shape-radius-card)',
          height: '100%',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border-card-hover)'
          e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border-card)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div
          className="flex items-center"
          style={{
            gap: 'var(--space-layout-element)',
            marginBottom: 'var(--space-12)',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--shape-radius-avatar)',
              backgroundColor: 'var(--color-background-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
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
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {goal.title}
          </h3>
        </div>

        <div style={{ marginBottom: 'var(--space-12)' }}>
          <div
            style={{
              width: '100%',
              height: '6px',
              borderRadius: 'var(--shape-radius-icon)',
              backgroundColor: 'var(--color-background-tertiary)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: 'var(--color-green-500)',
                borderRadius: 'var(--shape-radius-icon)',
                transition: 'width 0.3s ease-out',
              }}
            />
          </div>
        </div>

        <div
          className="flex items-center justify-between"
          style={{
            fontSize: 'var(--font-size-text-caption)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>
            {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
          </span>
        </div>

        {goal.deadline && (
          <div
            className="flex items-center"
            style={{
              marginTop: 'var(--space-8)',
              gap: 'var(--space-gap-tight)',
              fontSize: 'var(--font-size-text-caption)',
              color: 'var(--color-text-tertiary)',
            }}
          >
            <Icon name="calendar" size={12} color="var(--color-text-tertiary)" />
            <span>{formatDateShort(goal.deadline)}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
