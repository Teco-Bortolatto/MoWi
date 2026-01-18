import { DashboardHeader } from '../components/features/dashboard/DashboardHeader'

function DashboardPage() {
  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: 'var(--color-neutral-100)' }}>
      <div className="w-full" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <DashboardHeader />
        <div
          style={{
            paddingLeft: 'var(--space-16)',
            paddingRight: 'var(--space-16)',
            paddingBottom: 'var(--space-24)',
          }}
        >
          <p
            style={{
              fontSize: 'var(--font-size-label-small)',
              color: 'var(--color-neutral-600)',
            }}
          >
            Cards de resumo financeiro serão implementados no próximo prompt.
        </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
