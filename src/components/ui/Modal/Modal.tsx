import { ReactNode, useEffect } from 'react'
import { Button } from '../Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  icon?: ReactNode
}

/**
 * Componente Modal base reutilizável
 */
export function Modal({ isOpen, onClose, title, subtitle, children, icon }: ModalProps) {
  // Fechar modal com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'var(--shadow-modal-backdrop)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
        style={{
          width: '90%',
          maxWidth: 'var(--size-modal-width-large)',
          padding: 'var(--space-padding-modal)',
          backgroundColor: 'var(--color-background-surface)',
          borderRadius: 'var(--shape-radius-modal)',
          boxShadow: 'var(--shadow-modal)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between"
          style={{
            marginBottom: 'var(--space-24)',
          }}
        >
          <div className="flex items-start" style={{ gap: 'var(--space-12)' }}>
            {icon && <div style={{ marginTop: 'var(--space-4)' }}>{icon}</div>}
            <div>
              <h2
                style={{
                  fontSize: 'var(--font-size-heading-section)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: subtitle ? 'var(--space-4)' : '0',
                  fontFeatureSettings: "'liga' off",
                }}
              >
                {title}
              </h2>
              {subtitle && (
                <p
                  style={{
                    fontSize: 'var(--font-size-text-small)',
                    color: 'var(--color-neutral-600)',
                    lineHeight: 'var(--font-line-height-default)',
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="tertiary"
            size="small"
            icon="x"
            iconOnly
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--shape-8)',
            }}
            aria-label="Fechar"
          />
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  )
}
