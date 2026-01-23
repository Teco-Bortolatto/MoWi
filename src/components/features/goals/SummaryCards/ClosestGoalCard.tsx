import { Goal } from '../../../../types'

interface ClosestGoalCardProps {
  goal: Goal | null
}

export function ClosestGoalCard({ goal }: ClosestGoalCardProps) {
  if (!goal) {
    return (
      <div
        style={{
          padding: 'var(--space-layout-component)',
          borderRadius: 'var(--shape-radius-card)',
          backgroundColor: 'var(--color-background-tertiary)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--color-border-default)',
        }}
      >
        <p
          style={{
            fontSize: 'var(--font-size-text-caption)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-layout-element)',
          }}
        >
          Meta Mais Próxima
        </p>
        <p
          style={{
            fontSize: 'var(--font-size-text-body-medium)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Nenhuma meta com prazo definido
        </p>
      </div>
    )
  }

  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
  const progressPercentage = Math.min(Math.max(progress, 0), 100)

  return (
    <div
      style={{
        padding: 'var(--space-layout-component)',
        borderRadius: 'var(--shape-radius-card)',
        backgroundColor: 'var(--color-yellow-200)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-yellow-300)',
      }}
    >
      <p
        style={{
          fontSize: 'var(--font-size-text-caption)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-layout-element)',
        }}
      >
        Meta Mais Próxima
      </p>
      <p
        style={{
          fontSize: 'var(--font-size-text-label)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-gap-tight)',
          fontFeatureSettings: "'liga' off",
        }}
      >
        {goal.title}
      </p>
      <p
        style={{
          fontSize: 'var(--font-size-heading-label)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-primary)',
          fontFeatureSettings: "'liga' off",
        }}
      >
        {progressPercentage.toFixed(0)}%
      </p>
    </div>
  )
}
