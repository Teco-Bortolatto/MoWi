import { useState } from 'react'
import { formatCurrency } from '../../../../utils/formatCurrency'

interface CategoryDonutCardProps {
  category: string
  amount: number
  percentage: number
  color: string
}

/**
 * Componente de card com gráfico donut para uma categoria
 */
export function CategoryDonutCard({ category, amount, percentage, color }: CategoryDonutCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Parâmetros do donut (conforme specs do Figma)
  const size = 131 // Diâmetro externo
  const innerDiameter = 97.09 // Diâmetro interno
  const innerRadius = innerDiameter / 2
  const outerRadius = size / 2
  const strokeWidth = outerRadius - innerRadius // Largura do anel
  const center = size / 2
  const circumference = 2 * Math.PI * outerRadius

  // Calcular o offset do stroke para mostrar o percentual
  const percentageValue = Math.min(percentage, 100) // Limitar a 100%
  const offset = circumference - (percentageValue / 100) * circumference

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        width: 'var(--size-card-donut-width)',
        padding: 'var(--space-padding-card)',
        backgroundColor: 'var(--color-background-card)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: isHovered ? 'var(--color-border-card-hover)' : 'var(--color-border-card)',
        borderRadius: 'var(--shape-radius-card)',
        transition: 'border-color 0.2s ease',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gráfico Donut */}
      <div className="relative flex items-center justify-center" style={{ marginBottom: 'var(--space-32)', width: size, height: size, gap: 'var(--space-6)' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Círculo de fundo (cinza) - anel completo */}
          <circle
            cx={center}
            cy={center}
            r={center - strokeWidth / 2}
            fill="none"
            stroke="#D0D5DC"
            strokeWidth={strokeWidth}
          />
          {/* Círculo do percentual (colorido) - anel */}
          {percentage > 0 && (
            <circle
              cx={center}
              cy={center}
              r={center - strokeWidth / 2}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.3s ease',
              }}
            />
          )}
        </svg>
        {/* Percentual no centro */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            fontSize: 'var(--font-size-heading-section)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
            lineHeight: '32px',
            fontFeatureSettings: "'liga' off",
            textAlign: 'center',
          }}
        >
          {percentage.toFixed(1)}%
        </div>
      </div>

      {/* Nome da Categoria */}
      <p
        style={{
          fontSize: 'var(--font-size-text-label)',
          fontWeight: 'var(--font-weight-bold)',
          lineHeight: 'var(--font-line-height-default)',
          letterSpacing: '0.3px',
          color: 'var(--color-text-primary)',
          textAlign: 'center',
          marginBottom: 'var(--space-8)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
          fontFeatureSettings: "'liga' off",
        }}
      >
        {category}
      </p>

      {/* Valor */}
      <p
        style={{
          fontSize: 'var(--font-size-heading-small)',
          fontWeight: 'var(--font-weight-bold)',
          lineHeight: 'var(--font-line-height-tight)',
          color: 'var(--color-neutral-1000)',
          textAlign: 'center',
          fontFeatureSettings: "'liga' off",
        }}
      >
        {formatCurrency(amount)}
      </p>
    </div>
  )
}
