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
    if (!isExpanded) {
      setTimeout(() => setShowTooltip(true), 300)
    }
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  return (
    <div className="relative">
      <Link
        to={path}
        className="flex items-center transition-all duration-200"
        style={{
          height: 'var(--size-48)',
          marginBottom: 'var(--space-4)',
          borderRadius: 'var(--shape-8)',
          paddingLeft: isExpanded ? 'var(--space-24)' : 'var(--space-16)',
          paddingRight: isExpanded ? 'var(--space-24)' : 'var(--space-16)',
          justifyContent: isExpanded ? 'flex-start' : 'center',
          backgroundColor: isActive ? 'var(--color-neutral-1100)' : 'transparent',
          color: isActive ? 'var(--color-neutral-0)' : 'var(--color-neutral-600)',
        }}
        onMouseEnter={(e) => {
          handleMouseEnter()
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
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
            color={isActive ? 'var(--color-green-600)' : 'var(--color-neutral-600)'}
          />
        </div>
        {isExpanded && (
          <span
            style={{
              fontSize: 'var(--font-size-label-medium)',
              fontWeight: 'var(--font-weight-semibold)',
              color: isActive ? 'var(--color-neutral-0)' : 'var(--color-neutral-600)',
              lineHeight: 'var(--font-line-height-default)',
              letterSpacing: 'var(--font-letter-spacing-default)',
            }}
          >
            {label}
          </span>
        )}
      </Link>

      {/* Tooltip quando colapsado */}
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
            backgroundColor: 'var(--color-neutral-900)',
            color: 'var(--color-neutral-0)',
            boxShadow: `var(--shadow-offset-x-right-4) var(--shadow-offset-y-down-4) var(--shadow-blur-16) var(--shadow-spread-0) var(--shadow-color-neutral-24)`,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {label}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2"
            style={{
              transform: 'translate(-50%, -50%) rotate(45deg)',
              width: 'var(--space-8)',
              height: 'var(--space-8)',
              marginLeft: 'var(--space-negative-4)',
              backgroundColor: 'var(--color-neutral-900)',
            }}
          ></div>
        </div>
      )}
    </div>
  )
}
