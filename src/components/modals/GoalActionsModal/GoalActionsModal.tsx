import { useFinance } from '../../../contexts'
import { Modal } from '../../ui/Modal'
import { Icon } from '../../ui/Icon'
import { Button } from '../../ui/Button'
import { Goal } from '../../../types'

interface GoalActionsModalProps {
  isOpen: boolean
  onClose: () => void
  goal: Goal | null
  onAddValue: () => void
  onEdit: () => void
}

export function GoalActionsModal({
  isOpen,
  onClose,
  goal,
  onAddValue,
  onEdit,
}: GoalActionsModalProps) {
  const { deleteGoal } = useFinance()

  if (!goal) return null

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir o objetivo "${goal.title}"?`)) {
      deleteGoal(goal.id)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goal.title}
      subtitle="Escolha uma ação"
      icon={<Icon name="target" size={20} color="var(--color-text-primary)" />}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-layout-element)' }}>
        <Button
          onClick={() => {
            onAddValue()
            onClose()
          }}
          variant="primary"
          size="medium"
          icon="arrow-up"
          fullWidth
        >
          Adicionar Valor
        </Button>

        <Button
          onClick={() => {
            onEdit()
            onClose()
          }}
          variant="secondary"
          size="medium"
          icon="settings"
          fullWidth
        >
          Editar Meta
        </Button>

        <div
          style={{
            marginTop: 'var(--space-layout-component)',
            paddingTop: 'var(--space-layout-component)',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'var(--color-border-default)',
          }}
        >
          <Button
            onClick={handleDelete}
            variant="danger-tertiary"
            size="medium"
            icon="x"
            fullWidth
          >
            Excluir Objetivo
          </Button>
        </div>
      </div>
    </Modal>
  )
}
