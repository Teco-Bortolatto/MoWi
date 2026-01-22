
interface AvatarProps {
  src?: string | null
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  xs: 'var(--size-avatar-xs)',
  sm: 'var(--size-avatar-small)',
  md: 'var(--size-avatar-medium)',
  lg: 'var(--size-avatar-large)',
}

export function Avatar({ src, alt = 'Avatar', size = 'md', className = '' }: AvatarProps) {
  const avatarSize = sizeMap[size]

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`object-cover ${className}`}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: 'var(--shape-radius-avatar)',
        }}
      />
    )
  }

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        width: avatarSize,
        height: avatarSize,
        borderRadius: 'var(--shape-100)',
        backgroundColor: 'var(--color-background-tertiary)',
        overflow: 'hidden',
      }}
      aria-label={alt}
    >
      <span
        style={{
          fontSize: size === 'xs' ? '10px' : size === 'sm' ? 'var(--font-size-text-caption)' : 'var(--font-size-text-label)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-text-secondary)',
          lineHeight: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        {alt.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}
