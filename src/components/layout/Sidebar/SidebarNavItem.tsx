import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from '../../ui/Icon'
import type { IconName } from '../../ui/Icon'

interface SidebarNavItemProps {
  path: string
  label: string
  icon: IconName
  isExpanded: boolean
}

export function SidebarNavItem({ path, label, icon, isExpanded }: SidebarNavItemProps) {
  const location = useLocation()
  const isActive = location.pathname === path
  const [showTooltip, setShowTooltip] = useState(false)

  const handleMouseEnter = () => {
    if (!isExpanded) setShowTooltip(true)
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  return (
    <div className="relative">
      <Link
        to={path}
        className="flex items-center"
        style={{
          height: 'var(--size-48)',
          marginBottom: 'var(--space-4)',
          borderRadius: '32px',
          paddingLeft: isExpanded ? 'var(--space-24)' : 'var(--space-16)',
          paddingRight: isExpanded ? 'var(--space-24)' : 'var(--space-16)',
          justifyContent: isExpanded ? 'flex-start' : 'center',
          backgroundColor: isActive ? 'var(--color-background-action-primary)' : 'transparent',
          color: isActive ? 'var(--color-background-action-secondary)' : 'var(--color-text-secondary)',
        }}
        onMouseEnter={(e) => {
          handleMouseEnter()
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
          }
        }}
        onMouseLeave={(e) => {
          handleMouseLeave()
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
      >
        <div
          style={{
            marginRight: isExpanded ? 'var(--space-12)' : '0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Icon
            name={icon}
            size={20}
            color={isActive ? 'var(--color-background-action-secondary)' : 'var(--color-neutral-600)'}
          />
        </div>
        {isExpanded && (
          <span
            style={{
              fontSize: 'var(--font-size-text-label)',
              fontWeight: 'var(--font-weight-semibold)',
              color: isActive ? 'var(--color-background-action-secondary)' : 'var(--color-text-secondary)',
              lineHeight: 'var(--font-line-height-default)',
              letterSpacing: 'var(--font-letter-spacing-default)',
            }}
          >
            {label}
          </span>
        )}
      </Link>

      {/* Tooltip quando colapsado — sem losango nem shadow */}
      {!isExpanded && showTooltip && (
        <div
          className="absolute left-full whitespace-nowrap z-50 pointer-events-none"
          style={{
            marginLeft: 'var(--space-8)',
            paddingLeft: 'var(--space-12)',
            paddingRight: 'var(--space-12)',
            paddingTop: 'var(--space-8)',
            paddingBottom: 'var(--space-8)',
            fontSize: 'var(--font-size-label-small)',
            borderRadius: 'var(--shape-8)',
            backgroundColor: isActive ? 'var(--color-background-action-primary)' : 'var(--color-background-card)',
            color: isActive ? 'var(--color-text-action-primary)' : 'var(--color-text-primary)',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {label}
        </div>
      )}
    </div>
  )
}
