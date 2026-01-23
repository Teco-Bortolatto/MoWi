import { DashboardHeader } from '../components/features/dashboard/DashboardHeader'
import { BalanceCard, IncomeCard, ExpenseCard } from '../components/features/dashboard/SummaryCards'
import { ExpensesByCategoryCarousel } from '../components/features/dashboard/ExpensesByCategoryCarousel'
import { FinancialFlowChart } from '../components/features/dashboard/FinancialFlowChart'
import { CreditCardsWidget } from '../components/features/dashboard/CreditCardsWidget'
import { UpcomingExpensesWidget } from '../components/features/dashboard/UpcomingExpensesWidget'
import { TransactionsTable } from '../components/features/dashboard/TransactionsTable'

function DashboardPage() {
  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: 'var(--color-background-dashboard)' }}>
      <div
        className="w-full flex flex-col lg:pt-0"
        style={{
          paddingTop: 'var(--space-header-height)',
          paddingBottom: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
          gap: '0px',
        }}
      >
        <DashboardHeader />
        <div
          className="flex flex-col"
          style={{
            paddingTop: '0px',
            paddingBottom: 'var(--space-layout-section)',
            paddingLeft: '0px',
            paddingRight: '0px',
            width: '100%',
            gap: 'var(--space-layout-section)',
          }}
        >
          {/* Grid Principal - Desktop (≥1280px) usa grid-template-areas */}
          <div
            className="dashboard-grid-container"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-layout-section)',
            }}
          >
            {/* Porcentagens / Donuts */}
            <div className="dashboard-grid-porcentagens">
              <ExpensesByCategoryCarousel />
            </div>

            {/* Cards de Saldo (Saldo, Receitas, Despesas) */}
            <div className="dashboard-grid-cards-saldo">
              <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '16px' }}>
                <BalanceCard />
                <IncomeCard />
                <ExpenseCard />
              </div>
            </div>

            {/* Cartões e Contas - Ocupa 2 linhas no desktop */}
            <div className="dashboard-grid-cartoes">
              <CreditCardsWidget />
            </div>

            {/* Fluxo Financeiro */}
            <div className="dashboard-grid-fluxo">
              <FinancialFlowChart />
            </div>

            {/* Próximas Despesas */}
            <div className="dashboard-grid-proximas">
              <UpcomingExpensesWidget />
            </div>

            {/* Extrato Detalhado - Ocupa as duas colunas */}
            <div className="dashboard-grid-extrato">
              <TransactionsTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
