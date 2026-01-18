import { Avatar } from '../../ui/Avatar'

interface SidebarUserInfoProps {
  isExpanded: boolean
  userName?: string
  userEmail?: string
  userAvatar?: string | null
}

export function SidebarUserInfo({
  isExpanded,
  userName = 'Moises Wilson',
  userEmail = 'MoWill_95@gmail.com',
  userAvatar = null,
}: SidebarUserInfoProps) {
  if (!isExpanded) {
    return (
      <div
        className="flex items-center justify-center border-t"
        style={{
          height: 'var(--size-64)',
          paddingLeft: 'var(--space-16)',
          paddingRight: 'var(--space-16)',
          borderTopColor: 'var(--color-neutral-300)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
        }}
      >
        <Avatar src={userAvatar} alt={userName} size="sm" />
      </div>
    )
  }

  return (
    <div
      className="border-t"
      style={{
        paddingLeft: 'var(--space-24)',
        paddingRight: 'var(--space-24)',
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-16)',
        borderTopColor: 'var(--color-neutral-300)',
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
          <Avatar src={userAvatar} alt={userName} size="md" />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="truncate"
            style={{
              fontSize: 'var(--font-size-label-small)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-neutral-900)',
              lineHeight: 'var(--font-line-height-default)',
              letterSpacing: 'var(--font-letter-spacing-default)',
            }}
          >
            {userName}
          </p>
          <p
            className="truncate"
            style={{
              fontSize: 'var(--font-size-label-x-small)',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--color-neutral-600)',
              lineHeight: 'var(--font-line-height-default)',
              letterSpacing: 'var(--font-letter-spacing-default)',
            }}
          >
            {userEmail}
          </p>
        </div>
      </div>
    </div>
  )
}
