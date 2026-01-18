import { useSidebar } from '../../../hooks/useSidebar'
import { SidebarLogo } from './SidebarLogo'
import { SidebarNavItem } from './SidebarNavItem'
import { SidebarUserInfo } from './SidebarUserInfo'
import { Icon } from '../../ui/Icon'
import { NAVIGATION_ITEMS } from '../../../constants'

export function Sidebar() {
  const { isExpanded, toggle } = useSidebar()

  // Larguras baseadas em tokens primitivos do Figma
  // Expanded: 256px (size/64 * 4 = 64 * 4 = 256px)
  // Collapsed: 80px (size/80)
  const sidebarWidth = isExpanded ? '256px' : '80px'

  return (
    <>
      {/* Sidebar - apenas desktop (≥1280px) */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen transition-all duration-300 ease-in-out z-40"
        style={{
          backgroundColor: 'var(--color-neutral-0)',
          borderRightColor: 'var(--color-neutral-300)',
          borderRightWidth: '1px',
          borderRightStyle: 'solid',
          width: sidebarWidth,
        }}
      >
        {/* Logo */}
        <SidebarLogo isExpanded={isExpanded} />

        {/* Navigation Items */}
        <nav
          className="flex-1 overflow-y-auto"
          style={{
            paddingTop: 'var(--space-16)',
            paddingBottom: 'var(--space-16)',
            paddingLeft: 'var(--space-8)',
            paddingRight: 'var(--space-8)',
          }}
        >
          {NAVIGATION_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.path}
              path={item.path}
              label={item.label}
              icon={item.icon as any}
              isExpanded={isExpanded}
            />
          ))}
        </nav>

        {/* User Info */}
        <SidebarUserInfo isExpanded={isExpanded} />

        {/* Toggle Button */}
        <button
          onClick={toggle}
          className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-200 focus:outline-none"
          style={{
            right: 'var(--space-negative-16)',
            width: 'var(--size-32)',
            height: 'var(--size-32)',
            borderRadius: 'var(--shape-100)',
            backgroundColor: 'var(--color-neutral-900)',
            color: 'var(--color-neutral-0)',
            boxShadow: `var(--shadow-offset-x-right-4) var(--shadow-offset-y-down-4) var(--shadow-blur-16) var(--shadow-spread-0) var(--shadow-color-neutral-24)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-neutral-1000)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-neutral-900)'
          }}
          aria-label={isExpanded ? 'Colapsar sidebar' : 'Expandir sidebar'}
        >
          <Icon
            name={isExpanded ? 'chevron-left' : 'chevron-right'}
            size={16}
            color="var(--color-neutral-0)"
          />
        </button>
      </aside>

      {/* Spacer para empurrar conteúdo quando sidebar está visível */}
      <div
        className="hidden lg:block transition-all duration-300 ease-in-out"
        style={{
          width: sidebarWidth,
        }}
      />
    </>
  )
}
