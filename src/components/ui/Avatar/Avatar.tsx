
interface AvatarProps {
  src?: string | null
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'var(--size-32)',
  md: 'var(--size-40)',
  lg: 'var(--size-48)',
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
          borderRadius: 'var(--shape-100)',
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
        backgroundColor: 'var(--color-neutral-300)',
      }}
      aria-label={alt}
    >
      <span
        style={{
          fontSize: size === 'sm' ? 'var(--font-size-label-x-small)' : 'var(--font-size-label-small)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-neutral-600)',
          lineHeight: 'var(--font-line-height-tight)',
        }}
      >
        {alt.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}
