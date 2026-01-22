import { useState, useMemo } from 'react'
import { useFinance } from '../contexts'
import { Button } from '../components/ui/Button'
import { TotalSavedCard, ClosestGoalCard } from '../components/features/goals/SummaryCards'
import { GoalCard } from '../components/features/goals/GoalCard'
import { NewGoalModal } from '../components/modals/NewGoalModal'
import { AddGoalValueModal } from '../components/modals/AddGoalValueModal'
import { GoalActionsModal } from '../components/modals/GoalActionsModal'
import { Icon } from '../components/ui/Icon'
import { Goal } from '../types'

function GoalsPage() {
  const { goals, updateGoal, deleteGoal } = useFinance()
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false)
  const [isAddValueModalOpen, setIsAddValueModalOpen] = useState(false)
  const [isGoalActionsModalOpen, setIsGoalActionsModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

  // Calcular total poupado
  const totalSaved = useMemo(() => {
    return goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  }, [goals])

  // Encontrar meta mais próxima (com deadline mais próximo)
  const closestGoal = useMemo(() => {
    const goalsWithDeadline = goals.filter((g) => g.deadline && !g.isCompleted)
    if (goalsWithDeadline.length === 0) return null

    const now = new Date()
    return goalsWithDeadline.reduce((closest, current) => {
      if (!closest.deadline || !current.deadline) return closest
      const closestTime = closest.deadline.getTime() - now.getTime()
      const currentTime = current.deadline.getTime() - now.getTime()
      return currentTime < closestTime && currentTime > 0 ? current : closest
    })
  }, [goals])

  // Filtrar objetivos não completos
  const activeGoals = useMemo(() => {
    return goals.filter((goal) => !goal.isCompleted)
  }, [goals])

  const handleAddValue = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId)
    if (goal) {
      setSelectedGoal(goal)
      setIsAddValueModalOpen(true)
    }
  }

  const handleEdit = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId)
    if (goal) {
      setSelectedGoal(goal)
      setIsGoalActionsModalOpen(true)
    }
  }

  const handleOpenAddValue = () => {
    if (selectedGoal) {
      setIsAddValueModalOpen(true)
    }
  }

  const handleOpenEdit = () => {
    // Por enquanto, apenas abrimos o modal de adicionar valor como edição
    // Em uma implementação completa, haveria um modal de edição separado
    if (selectedGoal) {
      setIsAddValueModalOpen(true)
    }
  }

  const handleCloseAddValueModal = () => {
    setIsAddValueModalOpen(false)
    setSelectedGoal(null)
  }

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: 'var(--color-background-dashboard)' }}>
      <div
        className="w-full lg:pt-[var(--space-layout-section)]"
        style={{
          paddingTop: 'calc(var(--space-layout-section) + var(--space-header-height))',
          paddingBottom: 'var(--space-layout-section)',
        }}
      >
        {/* Header */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between"
          style={{
            marginBottom: 'var(--space-layout-container)',
            gap: 'var(--space-layout-component)',
          }}
        >
          <h1
            style={{
              fontSize: 'var(--font-size-heading-section)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              fontFeatureSettings: "'liga' off",
            }}
          >
            Meus Objetivos
          </h1>
          <Button
            onClick={() => setIsNewGoalModalOpen(true)}
            variant="primary"
            size="medium"
            icon="plus"
          >
            Novo Objetivo
          </Button>
        </div>

        {/* Cards de Resumo */}
        {goals.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{
              width: '100%',
              marginBottom: 'var(--space-layout-container)',
              marginLeft: '0px',
              marginRight: '0px',
              marginTop: '0px',
              columnGap: '24px',
              rowGap: '24px',
            }}
          >
            <TotalSavedCard totalSaved={totalSaved} />
            <ClosestGoalCard goal={closestGoal} />
          </div>
        )}

        {/* Grid de Objetivos ou Empty State */}
        {activeGoals.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center"
            style={{
              padding: 'var(--space-layout-container)',
              minHeight: '400px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                marginBottom: 'var(--space-layout-component)',
                opacity: 0.3,
              }}
            >
              🏆
            </div>
            <h2
              style={{
                fontSize: 'var(--font-size-heading-label)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-layout-element)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Você ainda não tem metas definidas
            </h2>
            <p
              style={{
                fontSize: 'var(--font-size-text-body-medium)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-layout-container)',
              }}
            >
              Crie seu primeiro objetivo financeiro e comece a planejar seu futuro.
            </p>
            <Button
              onClick={() => setIsNewGoalModalOpen(true)}
              variant="primary"
              size="medium"
              icon="plus"
            >
              Criar Primeiro Objetivo
            </Button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            style={{
              width: '100%',
              marginLeft: '0px',
              marginRight: '0px',
              marginTop: '0px',
              marginBottom: '0px',
              columnGap: '24px',
              rowGap: '24px',
            }}
          >
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddValue={handleAddValue}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}

        {/* Modais */}
        <NewGoalModal
          isOpen={isNewGoalModalOpen}
          onClose={() => setIsNewGoalModalOpen(false)}
        />

        <AddGoalValueModal
          isOpen={isAddValueModalOpen}
          onClose={handleCloseAddValueModal}
          goal={selectedGoal}
        />

        <GoalActionsModal
          isOpen={isGoalActionsModalOpen}
          onClose={() => {
            setIsGoalActionsModalOpen(false)
            setSelectedGoal(null)
          }}
          goal={selectedGoal}
          onAddValue={handleOpenAddValue}
          onEdit={handleOpenEdit}
        />
      </div>
    </div>
  )
}

export default GoalsPage
