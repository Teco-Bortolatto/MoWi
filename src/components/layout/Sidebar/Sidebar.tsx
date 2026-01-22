import { useSidebar } from '../../../hooks/useSidebar'
import { SidebarLogo } from './SidebarLogo'
import { SidebarNavItem } from './SidebarNavItem'
import { SidebarUserInfo } from './SidebarUserInfo'
import { Button } from '../../ui/Button'
import { NAVIGATION_ITEMS } from '../../../constants'

export function Sidebar() {
  const { isExpanded, toggle } = useSidebar()

  // Larguras usando tokens semânticos
  const sidebarWidth = isExpanded
    ? 'var(--size-sidebar-width-expanded)'
    : 'var(--size-sidebar-width-collapsed)'

  return (
    <>
      {/* Sidebar - apenas desktop (≥1280px) */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen transition-all duration-300 ease-in-out z-40"
        style={{
          backgroundColor: 'var(--color-background-sidebar)',
          borderRightColor: 'var(--color-border-default)',
          borderRightWidth: '1px',
          borderRightStyle: 'solid',
          width: sidebarWidth,
        }}
      >
        {/* Logo */}
        <SidebarLogo isExpanded={isExpanded} />

        {/* Navigation Items */}
        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden relative"
          style={{
            paddingTop: 'var(--space-layout-component)',
            paddingBottom: 'var(--space-layout-component)',
            paddingLeft: 'var(--space-sidebar-padding)',
            paddingRight: 'var(--space-sidebar-padding)',
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
        <Button
          onClick={toggle}
          variant="tertiary"
          size="small"
          icon={isExpanded ? 'chevron-left' : 'chevron-right'}
          iconOnly
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            right: 'var(--space-negative-16)',
            boxShadow: 'var(--shadow-card-hover)',
            backgroundColor: 'var(--color-background-card)',
          }}
          aria-label={isExpanded ? 'Colapsar sidebar' : 'Expandir sidebar'}
        />
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
