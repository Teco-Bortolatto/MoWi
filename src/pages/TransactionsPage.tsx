import { useState, useMemo } from 'react'
import { useFinance } from '../contexts'
import { TransactionsTable } from '../components/features/dashboard/TransactionsTable'
import { NewTransactionModal } from '../components/modals/NewTransactionModal'
import { Button } from '../components/ui/Button'
import { formatCurrency } from '../utils/formatCurrency'

function TransactionsPage() {
  const { getFilteredTransactions, calculateIncomeForPeriod, calculateExpensesForPeriod, filters } = useFinance()
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false)

  const filteredTransactions = getFilteredTransactions()
  const totalIncome = useMemo(
    () => calculateIncomeForPeriod(filters.dateRange.startDate || undefined, filters.dateRange.endDate || undefined),
    [calculateIncomeForPeriod, filters]
  )
  const totalExpenses = useMemo(
    () => calculateExpensesForPeriod(filters.dateRange.startDate || undefined, filters.dateRange.endDate || undefined),
    [calculateExpensesForPeriod, filters]
  )
  const difference = totalIncome - totalExpenses

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
            position: 'relative',
            zIndex: 1,
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
            Transações
          </h1>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8," 
                  + "Data,Descrição,Categoria,Tipo,Valor\n"
                  + filteredTransactions.map(t => `${t.date.toLocaleDateString()},${t.description},${t.category},${t.type},${t.amount}`).join("\n");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "transacoes_mowi.csv");
                document.body.appendChild(link);
                link.click();
              }}
              variant="secondary"
              size="medium"
              icon="download"
            >
              Exportar CSV
            </Button>
            <Button
              onClick={() => setIsNewTransactionModalOpen(true)}
              variant="primary"
              size="medium"
              icon="plus"
              style={{ position: 'relative', zIndex: 10 }}
            >
              Nova Transação
            </Button>
          </div>
        </div>

        {/* Resumo de estatísticas */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          style={{
            marginBottom: 'var(--space-layout-section)',
            columnGap: '16px',
            rowGap: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-background-card)',
              borderRadius: 'var(--shape-radius-card)',
              padding: 'var(--space-layout-component)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border-card)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-text-body-small)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-gap-tight)',
              }}
            >
              Total de Receitas
            </p>
            <p
              style={{
                fontSize: 'var(--font-size-heading-card)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-success)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div
            style={{
              backgroundColor: 'var(--color-background-card)',
              borderRadius: 'var(--shape-radius-card)',
              padding: 'var(--space-layout-component)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border-card)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-text-body-small)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-gap-tight)',
              }}
            >
              Total de Despesas
            </p>
            <p
              style={{
                fontSize: 'var(--font-size-heading-card)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-error)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div
            style={{
              backgroundColor: 'var(--color-background-card)',
              borderRadius: 'var(--shape-radius-card)',
              padding: 'var(--space-layout-component)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border-card)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-text-body-small)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-gap-tight)',
              }}
            >
              Diferença
            </p>
            <p
              style={{
                fontSize: 'var(--font-size-heading-card)',
                fontWeight: 'var(--font-weight-bold)',
                color: difference >= 0 ? 'var(--color-text-success)' : 'var(--color-text-error)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              {formatCurrency(difference)}
            </p>
          </div>
          <div
            style={{
              backgroundColor: 'var(--color-background-card)',
              borderRadius: 'var(--shape-radius-card)',
              padding: 'var(--space-layout-component)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border-card)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-text-body-small)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-gap-tight)',
              }}
            >
              Quantidade
            </p>
            <p
              style={{
                fontSize: 'var(--font-size-heading-card)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                fontFeatureSettings: "'liga' off",
              }}
            >
              {filteredTransactions.length}
            </p>
          </div>
        </div>

        {/* Tabela de transações */}
        <TransactionsTable />
      </div>

      {/* Modal */}
      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
      />
    </div>
  )
}

export default TransactionsPage
