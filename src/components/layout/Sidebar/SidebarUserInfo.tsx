import { Avatar } from '../../ui/Avatar'
import { Icon } from '../../ui/Icon'
import { useAuth } from '../../../hooks/useAuth'

interface SidebarUserInfoProps {
  isExpanded: boolean
  userName?: string
  userEmail?: string
  userAvatar?: string | null
}

export function SidebarUserInfo({
  isExpanded,
  userName = 'Usuário',
  userEmail = '',
  userAvatar = null,
}: SidebarUserInfoProps) {
  const { signOut, user } = useAuth()
  
  const displayEmail = user?.email || userEmail
  const displayName = user?.user_metadata?.name || userName

  if (!isExpanded) {
    return (
      <div
        className="flex flex-col items-center justify-center border-t py-4 gap-4"
        style={{
          borderTopColor: 'var(--color-border-default)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
        }}
      >
        <Avatar src={userAvatar} alt={displayName} size="sm" />
        <button 
          onClick={() => signOut()}
          className="p-2 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-lg transition-colors"
          title="Sair"
        >
          <Icon name="log-out" size={20} />
        </button>
      </div>
    )
  }

  return (
    <div
      className="border-t"
      style={{
        paddingLeft: 'var(--space-layout-section)',
        paddingRight: 'var(--space-layout-section)',
        paddingTop: 'var(--space-layout-component)',
        paddingBottom: 'var(--space-layout-component)',
        borderTopColor: 'var(--color-border-default)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
      }}
    >
      <div
        className="flex items-center"
        style={{
          marginBottom: 'var(--space-12)',
        }}
      >
        <div
          style={{
            marginRight: 'var(--space-12)',
          }}
        >
          <Avatar src={userAvatar} alt={displayName} size="md" />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="truncate"
            style={{
              fontSize: 'var(--font-size-text-label)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)',
              lineHeight: 'var(--font-line-height-default)',
              letterSpacing: 'var(--font-letter-spacing-default)',
            }}
          >
            {displayName}
          </p>
          <p
            className="truncate"
            style={{
              fontSize: 'var(--font-size-text-caption)',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--color-text-secondary)',
              lineHeight: 'var(--font-line-height-default)',
              letterSpacing: 'var(--font-letter-spacing-default)',
            }}
          >
            {displayEmail}
          </p>
        </div>
      </div>
      
      <button
        onClick={() => signOut()}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
      >
        <Icon name="log-out" size={18} />
        <span>Sair da conta</span>
      </button>
    </div>
  )
}
