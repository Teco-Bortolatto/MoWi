import { Modal } from '../../ui/Modal'
import { Icon } from '../../ui/Icon'

interface FamilyMember {
  id: string
  name: string
  avatarUrl?: string | null
}

interface SelectProfileModalProps {
  isOpen: boolean
  onClose: () => void
  familyMembers: FamilyMember[]
  selectedMemberId: string | null
  onSelectMember: (memberId: string | null) => void
}

/**
 * Modal para seleção de perfil (tablet/mobile).
 * Opção "Mostrar todos os perfis" + lista de membros com alvo de toque ≥ 44px.
 */
export function SelectProfileModal({
  isOpen,
  onClose,
  familyMembers,
  selectedMemberId,
  onSelectMember,
}: SelectProfileModalProps) {
  const handleSelectAll = () => {
    onSelectMember(null)
    onClose()
  }

  const handleSelectMember = (id: string) => {
    onSelectMember(id)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ver gastos por perfil"
      subtitle="Escolha um perfil para filtrar o dashboard ou mostre todos."
      icon={<Icon name="user" size={20} color="var(--color-text-primary)" />}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {/* Opção: Mostrar todos os perfis */}
        <button
          type="button"
          onClick={handleSelectAll}
          className="w-full flex items-center justify-between text-left transition-colors rounded-lg"
          style={{
            minHeight: '44px',
            padding: 'var(--space-12) var(--space-16)',
            backgroundColor:
              selectedMemberId === null
                ? 'var(--color-background-action-primary)'
                : 'var(--color-background-tertiary)',
            color:
              selectedMemberId === null
                ? 'var(--color-text-on-action-primary)'
                : 'var(--color-text-primary)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor:
              selectedMemberId === null
                ? 'var(--color-background-action-primary)'
                : 'var(--color-border-default)',
            borderRadius: 'var(--shape-radius-button)',
            fontSize: 'var(--font-size-text-body)',
            fontWeight: 'var(--font-weight-semibold)',
            fontFeatureSettings: "'liga' off",
          }}
          aria-pressed={selectedMemberId === null}
          aria-label="Mostrar todos os perfis"
        >
          <span>Mostrar todos os perfis</span>
          {selectedMemberId === null && (
            <Icon name="check" size={20} color="var(--color-text-on-action-primary)" />
          )}
        </button>

        {/* Lista de membros */}
        {familyMembers.map((member) => {
          const isSelected = selectedMemberId === member.id
          const initial = member.name.charAt(0).toUpperCase()
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => handleSelectMember(member.id)}
              className="w-full flex items-center gap-3 text-left transition-colors rounded-lg"
              style={{
                minHeight: '44px',
                padding: 'var(--space-12) var(--space-16)',
                backgroundColor: isSelected
                  ? 'var(--color-background-action-primary)'
                  : 'var(--color-background-tertiary)',
                color: isSelected
                  ? 'var(--color-text-on-action-primary)'
                  : 'var(--color-text-primary)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isSelected
                  ? 'var(--color-background-action-primary)'
                  : 'var(--color-border-default)',
                borderRadius: 'var(--shape-radius-button)',
                fontSize: 'var(--font-size-text-body)',
                fontWeight: 'var(--font-weight-semibold)',
                fontFeatureSettings: "'liga' off",
              }}
              aria-pressed={isSelected}
              aria-label={`Ver gastos de ${member.name}`}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: isSelected
                    ? 'rgba(255,255,255,0.2)'
                    : 'var(--color-background-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: 'var(--font-size-text-label)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: isSelected
                        ? 'var(--color-text-on-action-primary)'
                        : 'var(--color-text-secondary)',
                    }}
                  >
                    {initial}
                  </span>
                )}
              </div>
              <span style={{ flex: 1, minWidth: 0 }}>{member.name}</span>
              {isSelected && (
                <Icon name="check" size={20} color="var(--color-text-on-action-primary)" />
              )}
            </button>
          )
        })}
      </div>
    </Modal>
  )
}
