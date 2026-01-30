import { formatCurrency } from '../../../../utils/formatCurrency'

interface TotalSavedCardProps {
  totalSaved: number
}

export function TotalSavedCard({ totalSaved }: TotalSavedCardProps) {
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
        Total Poupado
      </p>
      <p
        style={{
          fontSize: 'var(--font-size-heading-label)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-primary)',
          fontFeatureSettings: "'liga' off",
        }}
      >
        {formatCurrency(totalSaved)}
      </p>
    </div>
  )
}
