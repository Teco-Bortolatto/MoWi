interface SidebarLogoProps {
  isExpanded: boolean
}

export function SidebarLogo({ isExpanded }: SidebarLogoProps) {
  if (!isExpanded) {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          height: 'var(--size-64)',
          paddingLeft: 'var(--space-16)',
          paddingRight: 'var(--space-16)',
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 'var(--size-32)',
            height: 'var(--size-32)',
            borderRadius: 'var(--shape-8)',
            backgroundColor: 'var(--color-brand-500)',
          }}
        >
          <span
            style={{
              fontSize: 'var(--font-size-label-small)',
              color: 'var(--color-neutral-0)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 'var(--font-line-height-tight)',
            }}
          >
            M
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex items-center"
      style={{
        height: 'var(--size-64)',
        paddingLeft: 'var(--space-24)',
        paddingRight: 'var(--space-24)',
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 'var(--size-32)',
          height: 'var(--size-32)',
          borderRadius: 'var(--shape-8)',
          backgroundColor: 'var(--color-brand-500)',
          marginRight: 'var(--space-12)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--font-size-label-small)',
            color: 'var(--color-neutral-0)',
            fontWeight: 'var(--font-weight-bold)',
            lineHeight: 'var(--font-line-height-tight)',
          }}
        >
          M
        </span>
      </div>
      <span
        style={{
          fontSize: 'var(--font-size-label-large)',
          color: 'var(--color-neutral-900)',
          fontWeight: 'var(--font-weight-bold)',
          lineHeight: 'var(--font-line-height-default)',
          letterSpacing: 'var(--font-letter-spacing-default)',
        }}
      >
        mycash+
      </span>
    </div>
  )
}
