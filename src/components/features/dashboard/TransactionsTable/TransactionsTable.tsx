import { useState, useMemo, useEffect } from 'react'
import { useFinance } from '../../../../contexts'
import { formatCurrency } from '../../../../utils/formatCurrency'
import { formatDate } from '../../../../utils/formatDate'
import { Icon } from '../../../ui/Icon'
import { Avatar } from '../../../ui/Avatar'
import { Button } from '../../../ui/Button'

const ITEMS_PER_PAGE = 5

/**
 * Componente de tabela de transações detalhada
 */
export function TransactionsTable() {
  const { getFilteredTransactions, familyMembers, accounts } = useFinance()
  const creditCards = useMemo(
    () => accounts.filter((acc) => acc.type === 'CREDIT_CARD'),
    [accounts]
  )
  const bankAccounts = useMemo(
    () => accounts.filter((acc) => acc.type !== 'CREDIT_CARD'),
    [accounts]
  )
  const [localSearchText, setLocalSearchText] = useState('')
  const [localTransactionType, setLocalTransactionType] = useState<'all' | 'INCOME' | 'EXPENSE'>('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Obter transações filtradas globalmente
  const globalFilteredTransactions = getFilteredTransactions()

  // Aplicar filtros locais
  const filteredTransactions = useMemo(() => {
    let filtered = [...globalFilteredTransactions]

    // Filtro local por texto
    if (localSearchText.trim()) {
      const searchLower = localSearchText.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchLower) ||
          (t.category && t.category.toLowerCase().includes(searchLower))
      )
    }

    // Filtro local por tipo
    if (localTransactionType !== 'all') {
      filtered = filtered.filter((t) => t.type === localTransactionType)
    }

    // Ordenar por data (mais recente primeiro)
    filtered.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    return filtered
  }, [globalFilteredTransactions, localSearchText, localTransactionType])

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1)
  }, [localSearchText, localTransactionType, globalFilteredTransactions.length])

  // Calcular paginação
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

  // Função para obter nome da conta/cartão
  const getAccountName = (accountId: string | null): string => {
    if (!accountId) return 'Desconhecido'

    const bankAccount = bankAccounts.find((acc) => acc.id === accountId)
    if (bankAccount) {
      return bankAccount.name
    }

    const creditCard = creditCards.find((card) => card.id === accountId)
    if (creditCard) {
      return creditCard.name
    }

    return 'Desconhecido'
  }

  // Função para obter membro
  const getMember = (memberId: string | null) => {
    if (!memberId) return null
    return familyMembers.find((m) => m.id === memberId) || null
  }

  // Função para renderizar páginas
  const renderPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      // Mostrar todas as páginas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Mostrar primeiras 3, ..., últimas 2
      pages.push(1, 2, 3)
      if (currentPage > 4 && currentPage < totalPages - 2) {
        pages.push('...')
        pages.push(currentPage - 1, currentPage, currentPage + 1)
        pages.push('...')
      } else if (currentPage <= 4) {
        pages.push(4, 5)
        pages.push('...')
      } else {
        pages.push('...')
      }
      pages.push(totalPages - 1, totalPages)
    }

    return pages
  }

  // Scroll para topo da tabela ao mudar página
  useEffect(() => {
    const tableElement = document.getElementById('transactions-table')
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [currentPage])

  return (
    <div
      id="transactions-table"
      style={{
        backgroundColor: 'var(--color-background-card)',
        borderRadius: 'var(--shape-radius-card)',
        padding: 'var(--space-padding-card)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border-card)',
        width: '100%',
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between"
        style={{
          marginBottom: 'var(--space-margin-section)',
          gap: 'var(--space-layout-component)',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--space-layout-element)' }}>
          <Icon name="list" size={16} color="var(--color-text-primary)" />
          <h3
            style={{
              fontSize: 'var(--font-size-heading-widget)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              fontFeatureSettings: "'liga' off",
            }}
          >
            Extrato detalhado
          </h3>
        </div>

        {/* Controles de busca e filtro */}
        <div className="flex items-center" style={{ gap: 'var(--space-layout-component)' }}>
          {/* Campo de busca */}
          <div
            className="relative flex items-center"
            style={{
              width: '256px',
            }}
          >
            <div
              className="absolute"
              style={{ left: 'var(--space-layout-component)', pointerEvents: 'none' }}
            >
              <Icon
                name="search"
                size={16}
                color="var(--color-text-secondary)"
              />
            </div>
            <input
              type="text"
              placeholder="Buscar lançamentos..."
              value={localSearchText}
              onChange={(e) => setLocalSearchText(e.target.value)}
              style={{
                width: '100%',
                height: 'var(--size-input-height-small)',
                paddingLeft: 'calc(var(--space-padding-input) + var(--size-icon-small) + var(--space-layout-element))',
                paddingRight: 'var(--space-layout-component)',
                paddingTop: 'var(--space-padding-icon)',
                paddingBottom: 'var(--space-padding-icon)',
                borderRadius: '32px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--color-border-input-default)',
                fontSize: 'var(--font-size-input-small)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          {/* Select de tipo */}
          <select
            value={localTransactionType}
            onChange={(e) => setLocalTransactionType(e.target.value as 'all' | 'INCOME' | 'EXPENSE')}
            style={{
              width: '140px',
              height: 'var(--size-input-height-small)',
              paddingLeft: 'var(--space-layout-component)',
              paddingRight: 'calc(var(--space-layout-component) + 24px)',
              borderRadius: '32px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border-input-default)',
              fontSize: 'var(--font-size-input-small)',
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-background-input-default)',
            }}
          >
            <option value="all">Todos</option>
            <option value="INCOME">Receitas</option>
            <option value="EXPENSE">Despesas</option>
          </select>
        </div>
      </div>

      {/* Tabela */}
      {filteredTransactions.length === 0 ? (
        <div
          className="flex items-center justify-center"
          style={{
            height: '96px',
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-text-body)',
          }}
        >
          Nenhum lançamento encontrado.
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead
                style={{
                  borderRadius: '16px 16px 0px 0px',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px',
                }}
              >
                <tr
                  style={{
                    backgroundColor: 'var(--color-background-tertiary)',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                  }}
                >
                  <th
                    style={{
                      padding: 'var(--space-padding-button-small)',
                      textAlign: 'left',
                      fontSize: 'var(--font-size-text-label)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-text-secondary)',
                      letterSpacing: '0.3px',
                      fontFeatureSettings: "'liga' off",
                      width: '50px',
                    }}
                  >
                    Membro
                  </th>
                  <th
                    style={{
                      padding: 'var(--space-padding-button-small)',
                      textAlign: 'left',
                      fontSize: 'var(--font-size-text-label)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-text-secondary)',
                      letterSpacing: '0.3px',
                      fontFeatureSettings: "'liga' off",
                    }}
                  >
                    Datas
                  </th>
                  <th
                    style={{
                      padding: 'var(--space-padding-button-small)',
                      textAlign: 'left',
                      fontSize: 'var(--font-size-text-label)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-text-secondary)',
                      letterSpacing: '0.3px',
                      fontFeatureSettings: "'liga' off",
                    }}
                  >
                    Descrição
                  </th>
                  <th
                    style={{
                      padding: 'var(--space-padding-button-small)',
                      textAlign: 'left',
                      fontSize: 'var(--font-size-text-label)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-text-secondary)',
                      letterSpacing: '0.3px',
                      fontFeatureSettings: "'liga' off",
                    }}
                  >
                    Categoria
                  </th>
                  <th
                    style={{
                      padding: 'var(--space-padding-button-small)',
                      textAlign: 'left',
                      fontSize: 'var(--font-size-text-label)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-text-secondary)',
                      letterSpacing: '0.3px',
                      fontFeatureSettings: "'liga' off",
                    }}
                  >
                    Conta/Cartão
                  </th>
                  <th
                    style={{
                      padding: 'var(--space-padding-button-small)',
                      textAlign: 'left',
                      fontSize: 'var(--font-size-text-label)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-text-secondary)',
                      letterSpacing: '0.3px',
                      fontFeatureSettings: "'liga' off",
                    }}
                  >
                    Parcelas
                  </th>
                  <th
                    style={{
                      padding: 'var(--space-padding-button-small)',
                      textAlign: 'right',
                      fontSize: 'var(--font-size-text-label)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-text-secondary)',
                      letterSpacing: '0.3px',
                      fontFeatureSettings: "'liga' off",
                    }}
                  >
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction, index) => {
                  const member = getMember(transaction.memberId)
                  const isEven = index % 2 === 0

                  return (
                    <tr
                      key={transaction.id}
                      style={{
                        backgroundColor: isEven ? 'var(--color-background-card)' : 'var(--color-background-secondary)',
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isEven ? 'var(--color-background-card)' : 'var(--color-background-secondary)'
                      }}
                    >
                      <td style={{ padding: 'var(--space-gap-component)' }}>
                        <Avatar
                          src={member?.avatarUrl || null}
                          alt={member?.name || 'Usuário'}
                          size="sm"
                        />
                      </td>
                      <td
                        style={{
                          padding: 'var(--space-padding-button-small)',
                          fontSize: 'var(--font-size-text-small)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {formatDate(transaction.date)}
                      </td>
                      <td style={{ padding: 'var(--space-gap-component)' }}>
                        <div className="flex items-center" style={{ gap: 'var(--space-layout-element)' }}>
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: 'var(--shape-radius-avatar)',
                              backgroundColor:
                                transaction.type === 'INCOME'
                                  ? 'var(--color-background-success)'
                                  : 'var(--color-background-error)',
                            }}
                          >
                            <Icon
                              name={transaction.type === 'INCOME' ? 'arrow-down-left' : 'arrow-up-right'}
                              size={12}
                              color={transaction.type === 'INCOME' ? 'var(--color-text-success)' : 'var(--color-text-error)'}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: 'var(--font-size-text-small)',
                              fontWeight: 'var(--font-weight-bold)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {transaction.description}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-gap-component)' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: 'var(--space-gap-tight) var(--space-layout-element)',
                            borderRadius: 'var(--shape-radius-badge)',
                            backgroundColor: 'var(--color-background-tertiary)',
                            fontSize: 'var(--font-size-text-caption)',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          {transaction.category}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: 'var(--space-padding-button-small)',
                          fontSize: 'var(--font-size-text-small)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {getAccountName(transaction.accountId)}
                      </td>
                      <td
                        style={{
                          padding: 'var(--space-padding-button-small)',
                          fontSize: 'var(--font-size-text-small)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {transaction.totalInstallments > 1
                          ? `${transaction.installmentNumber || 1}/${transaction.totalInstallments}`
                          : '-'}
                      </td>
                      <td
                        style={{
                          padding: 'var(--space-padding-button-small)',
                          textAlign: 'right',
                          fontSize: 'var(--font-size-text-small)',
                          fontWeight: 'var(--font-weight-bold)',
                          color:
                            transaction.type === 'INCOME'
                              ? 'var(--color-text-success)'
                              : 'var(--color-text-primary)',
                        }}
                      >
                        {transaction.type === 'INCOME' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div
            className="flex flex-col md:flex-row md:items-center md:justify-between"
            style={{
              marginTop: 'var(--space-margin-section)',
              gap: 'var(--space-layout-component)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-text-small)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Mostrando {startIndex + 1} a {Math.min(endIndex, filteredTransactions.length)} de{' '}
              {filteredTransactions.length}
            </p>

            <div className="flex items-center" style={{ gap: 'var(--space-layout-element)' }}>
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="tertiary"
                size="small"
                icon="chevron-left"
                iconOnly
                aria-label="Página anterior"
              />

              {renderPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      style={{
                        padding: 'var(--space-layout-element)',
                      fontSize: 'var(--font-size-text-small)',
                      color: 'var(--color-text-secondary)',
                      }}
                    >
                      ...
                    </span>
                  )
                }

                const pageNum = page as number
                const isActive = pageNum === currentPage

                return (
                  <Button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    variant={isActive ? 'primary' : 'tertiary'}
                    size="small"
                    style={{
                      width: '32px',
                      height: '32px',
                      minWidth: '32px',
                      padding: '0',
                      borderRadius: '50%',
                    }}
                  >
                    {pageNum}
                  </Button>
                )
              })}

              <Button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                variant="tertiary"
                size="small"
                icon="chevron-right"
                iconOnly
                aria-label="Próxima página"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
