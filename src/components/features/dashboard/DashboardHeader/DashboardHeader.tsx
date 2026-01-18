import { useState, useRef, useEffect } from 'react'
import { useFinance } from '../../../../contexts'
import { Icon } from '../../../ui/Icon'
import { Avatar } from '../../../ui/Avatar'
import {
  formatDateRange,
  getCurrentMonthRange,
  getLastMonthRange,
  getLastThreeMonthsRange,
  getCurrentYearRange,
} from '../../../../utils/formatDate'

export function DashboardHeader() {
  const {
    filters,
    setSearchText,
    setTransactionType,
    setDateRange,
    setSelectedMember,
    familyMembers,
  } = useFinance()

  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [currentMonth2, setCurrentMonth2] = useState(() => {
    const next = new Date()
    next.setMonth(next.getMonth() + 1)
    return next
  })

  const filterPopoverRef = useRef<HTMLDivElement>(null)
  const datePickerRef = useRef<HTMLDivElement>(null)

  // Fechar popovers ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterPopoverRef.current &&
        !filterPopoverRef.current.contains(event.target as Node)
      ) {
        setIsFilterPopoverOpen(false)
      }
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Formatar período atual
  const formatCurrentPeriod = () => {
    if (filters.dateRange.startDate && filters.dateRange.endDate) {
      return formatDateRange(filters.dateRange.startDate, filters.dateRange.endDate)
    }
    const { start, end } = getCurrentMonthRange()
    return formatDateRange(start, end)
  }

  // Atalhos de período
  const handlePeriodShortcut = (range: { start: Date; end: Date }) => {
    setDateRange({ startDate: range.start, endDate: range.end })
    setIsDatePickerOpen(false)
    setSelectedStartDate(null)
    setSelectedEndDate(null)
  }

  // Seleção de data no calendário
  const handleDateClick = (date: Date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date)
      setSelectedEndDate(null)
    } else if (selectedStartDate && !selectedEndDate) {
      if (date < selectedStartDate) {
        setSelectedEndDate(selectedStartDate)
        setSelectedStartDate(date)
      } else {
        setSelectedEndDate(date)
      }
    }
  }

  // Confirmar seleção de período
  const handleConfirmDateRange = () => {
    if (selectedStartDate && selectedEndDate) {
      setDateRange({ startDate: selectedStartDate, endDate: selectedEndDate })
      setIsDatePickerOpen(false)
      setSelectedStartDate(null)
      setSelectedEndDate(null)
    }
  }

  // Navegação do calendário
  const navigateMonth = (direction: 'prev' | 'next', calendarIndex: 1 | 2) => {
    if (calendarIndex === 1) {
      const newDate = new Date(currentMonth)
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
      setCurrentMonth(newDate)
      const newDate2 = new Date(newDate)
      newDate2.setMonth(newDate2.getMonth() + 1)
      setCurrentMonth2(newDate2)
    } else {
      const newDate = new Date(currentMonth2)
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
      setCurrentMonth2(newDate)
    }
  }

  // Gerar dias do mês
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const isDateInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false
    return date >= selectedStartDate && date <= selectedEndDate
  }

  const isDateSelected = (date: Date) => {
    if (selectedStartDate && date.toDateString() === selectedStartDate.toDateString()) return true
    if (selectedEndDate && date.toDateString() === selectedEndDate.toDateString()) return true
    return false
  }

  const isDateInFilterRange = (date: Date) => {
    if (!filters.dateRange.startDate || !filters.dateRange.endDate) return false
    return date >= filters.dateRange.startDate && date <= filters.dateRange.endDate
  }

  return (
    <div
      className="w-full flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4"
      style={{
        paddingTop: 'var(--space-24)',
        paddingBottom: 'var(--space-24)',
        paddingLeft: 'var(--space-16)',
        paddingRight: 'var(--space-16)',
      }}
    >
      {/* Campo de Busca */}
      <div
        className="relative flex-1 md:flex-initial"
        style={{ minWidth: '180px', maxWidth: '320px' }}
      >
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: 'var(--space-12)' }}
        >
          <Icon name="search" size={20} color="var(--color-neutral-600)" />
        </div>
        <input
          type="text"
          placeholder="Pesquisar..."
          value={filters.searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-0"
          style={{
            height: 'var(--size-48)',
            paddingLeft: 'var(--space-40)',
            paddingRight: 'var(--space-12)',
            borderRadius: 'var(--shape-8)',
            backgroundColor: 'var(--color-neutral-0)',
            borderColor: 'var(--color-neutral-300)',
            borderWidth: '1px',
            borderStyle: 'solid',
            fontSize: 'var(--font-size-label-medium)',
            color: 'var(--color-neutral-900)',
          }}
        />
      </div>

      {/* Botão Filtros */}
      <div className="relative" ref={filterPopoverRef}>
        <button
          onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
          className="flex items-center justify-center focus:outline-none transition-colors duration-200"
          style={{
            width: 'var(--size-48)',
            height: 'var(--size-48)',
            borderRadius: 'var(--shape-100)',
            backgroundColor: isFilterPopoverOpen
              ? 'var(--color-neutral-200)'
              : 'var(--color-neutral-0)',
            borderColor: 'var(--color-neutral-300)',
            borderWidth: '1px',
            borderStyle: 'solid',
          }}
          onMouseEnter={(e) => {
            if (!isFilterPopoverOpen) {
              e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isFilterPopoverOpen) {
              e.currentTarget.style.backgroundColor = 'var(--color-neutral-0)'
            }
          }}
          aria-label="Filtros"
        >
          <Icon name="filter" size={20} color="var(--color-neutral-900)" />
        </button>

        {/* Filter Popover (Desktop) */}
        {isFilterPopoverOpen && (
          <div
            className="hidden md:block absolute top-full mt-2 z-50"
            style={{
              right: 0,
              minWidth: '280px',
              padding: 'var(--space-16)',
              borderRadius: 'var(--shape-12)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: `0 var(--shadow-offset-y-down-16) var(--shadow-blur-24) var(--shadow-spread-0) var(--shadow-color-neutral-24)`,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 'var(--font-size-label-small)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-neutral-900)',
                  marginBottom: 'var(--space-12)',
                }}
              >
                Tipo de Transação
              </p>
              <div className="flex flex-col gap-1">
                {(['all', 'income', 'expense'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setTransactionType(type)
                      setIsFilterPopoverOpen(false)
                    }}
                    className="w-full text-left focus:outline-none transition-colors duration-200"
                    style={{
                      padding: 'var(--space-12)',
                      borderRadius: 'var(--shape-6)',
                      backgroundColor:
                        filters.transactionType === type
                          ? 'var(--color-neutral-1100)'
                          : 'transparent',
                      color:
                        filters.transactionType === type
                          ? 'var(--color-neutral-0)'
                          : 'var(--color-neutral-600)',
                      fontSize: 'var(--font-size-label-medium)',
                    }}
                    onMouseEnter={(e) => {
                      if (filters.transactionType !== type) {
                        e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.transactionType !== type) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    {type === 'all' && 'Todos'}
                    {type === 'income' && 'Receitas'}
                    {type === 'expense' && 'Despesas'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filter Modal (Mobile) */}
        {isFilterPopoverOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 z-40 transition-opacity duration-300"
              style={{
                backgroundColor: 'var(--color-neutral-1100)',
                opacity: 'var(--opacity-60)',
              }}
              onClick={() => setIsFilterPopoverOpen(false)}
            />
            <div
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out"
              style={{
                backgroundColor: 'var(--color-neutral-0)',
                borderTopLeftRadius: 'var(--shape-20)',
                borderTopRightRadius: 'var(--shape-20)',
                padding: 'var(--space-24)',
                paddingBottom: 'var(--space-32)',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: `0 var(--shadow-offset-y-up-16) var(--shadow-blur-24) var(--shadow-spread-0) var(--shadow-color-neutral-24)`,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  style={{
                    fontSize: 'var(--font-size-heading-small)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-neutral-900)',
                  }}
                >
                  Filtros
                </h2>
                <button
                  onClick={() => setIsFilterPopoverOpen(false)}
                  className="p-2 rounded-full transition-colors"
                  style={{
                    color: 'var(--color-neutral-600)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <Icon name="x" size={24} color="var(--color-neutral-900)" />
                </button>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 'var(--font-size-label-medium)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-neutral-900)',
                    marginBottom: 'var(--space-12)',
                  }}
                >
                  Tipo de Transação
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(['all', 'income', 'expense'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setTransactionType(type)
                        setIsFilterPopoverOpen(false)
                      }}
                      className="w-full text-center focus:outline-none transition-colors duration-200"
                      style={{
                        padding: 'var(--space-12)',
                        borderRadius: 'var(--shape-8)',
                        backgroundColor:
                          filters.transactionType === type
                            ? 'var(--color-neutral-1100)'
                            : 'var(--color-neutral-200)',
                        color:
                          filters.transactionType === type
                            ? 'var(--color-neutral-0)'
                            : 'var(--color-neutral-600)',
                        fontSize: 'var(--font-size-label-medium)',
                      }}
                    >
                      {type === 'all' && 'Todos'}
                      {type === 'income' && 'Receitas'}
                      {type === 'expense' && 'Despesas'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Seletor de Período */}
      <div className="relative" ref={datePickerRef}>
        <button
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          className="flex items-center gap-2 focus:outline-none transition-colors duration-200"
          style={{
            height: 'var(--size-48)',
            paddingLeft: 'var(--space-12)',
            paddingRight: 'var(--space-12)',
            borderRadius: 'var(--shape-8)',
            backgroundColor: 'var(--color-neutral-0)',
            borderColor: 'var(--color-neutral-300)',
            borderWidth: '1px',
            borderStyle: 'solid',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-neutral-0)'
          }}
        >
          <Icon name="calendar" size={20} color="var(--color-neutral-900)" />
          <span
            style={{
              fontSize: 'var(--font-size-label-medium)',
              color: 'var(--color-neutral-900)',
            }}
          >
            {formatCurrentPeriod()}
          </span>
        </button>

        {/* Date Picker (Desktop - 2 meses) */}
        {isDatePickerOpen && (
          <div
            className="hidden md:block absolute top-full mt-2 z-50"
            style={{
              right: 0,
              padding: 'var(--space-16)',
              borderRadius: 'var(--shape-12)',
              backgroundColor: 'var(--color-neutral-0)',
              boxShadow: `0 var(--shadow-offset-y-down-16) var(--shadow-blur-24) var(--shadow-spread-0) var(--shadow-color-neutral-24)`,
              minWidth: '600px',
              maxWidth: '90vw',
            }}
          >
            {/* Atalhos */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => handlePeriodShortcut(getCurrentMonthRange())}
                className="px-3 py-1.5 rounded transition-colors"
                style={{
                  backgroundColor: 'var(--color-neutral-200)',
                  color: 'var(--color-neutral-900)',
                  fontSize: 'var(--font-size-label-small)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-neutral-300)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
                }}
              >
                Este mês
              </button>
              <button
                onClick={() => handlePeriodShortcut(getLastMonthRange())}
                className="px-3 py-1.5 rounded transition-colors"
                style={{
                  backgroundColor: 'var(--color-neutral-200)',
                  color: 'var(--color-neutral-900)',
                  fontSize: 'var(--font-size-label-small)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-neutral-300)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
                }}
              >
                Mês passado
              </button>
              <button
                onClick={() => handlePeriodShortcut(getLastThreeMonthsRange())}
                className="px-3 py-1.5 rounded transition-colors"
                style={{
                  backgroundColor: 'var(--color-neutral-200)',
                  color: 'var(--color-neutral-900)',
                  fontSize: 'var(--font-size-label-small)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-neutral-300)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
                }}
              >
                Últimos 3 meses
              </button>
              <button
                onClick={() => handlePeriodShortcut(getCurrentYearRange())}
                className="px-3 py-1.5 rounded transition-colors"
                style={{
                  backgroundColor: 'var(--color-neutral-200)',
                  color: 'var(--color-neutral-900)',
                  fontSize: 'var(--font-size-label-small)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-neutral-300)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
                }}
              >
                Este ano
              </button>
            </div>

            {/* Dois calendários lado a lado */}
            <div className="flex gap-4">
              {[currentMonth, currentMonth2].map((month, idx) => {
                const days = getDaysInMonth(month)
                const monthName = month.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                return (
                  <div key={idx} style={{ flex: 1 }}>
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={() => navigateMonth('prev', idx === 0 ? 1 : 2)}
                        className="p-1 rounded transition-colors"
                        style={{
                          color: 'var(--color-neutral-600)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        <Icon name="chevron-left" size={16} color="var(--color-neutral-600)" />
                      </button>
                      <h3
                        className="font-semibold capitalize"
                        style={{
                          fontSize: 'var(--font-size-label-medium)',
                          color: 'var(--color-neutral-900)',
                        }}
                      >
                        {monthName}
                      </h3>
                      <button
                        onClick={() => navigateMonth('next', idx === 0 ? 1 : 2)}
                        className="p-1 rounded transition-colors"
                        style={{
                          color: 'var(--color-neutral-600)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        <Icon name="chevron-right" size={16} color="var(--color-neutral-600)" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7" style={{ gap: '4px' }}>
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                        <div
                          key={day}
                          className="text-center font-medium"
                          style={{
                            color: 'var(--color-neutral-600)',
                            padding: 'var(--space-4)',
                            fontSize: 'var(--font-size-label-x-small)',
                          }}
                        >
                          {day}
                        </div>
                      ))}
                      {days.map((date, dayIdx) => {
                        if (!date) {
                          return <div key={dayIdx} />
                        }
                        const isInRange = isDateInRange(date)
                        const isSelected = isDateSelected(date)
                        const isInFilterRange = isDateInFilterRange(date)
                        return (
                          <button
                            key={dayIdx}
                            onClick={() => handleDateClick(date)}
                            className="text-sm rounded transition-colors"
                            style={{
                              padding: 'var(--space-4)',
                              minHeight: 'var(--size-32)',
                              backgroundColor: isSelected
                                ? 'var(--color-brand-500)'
                                : isInRange
                                ? 'var(--color-brand-100)'
                                : isInFilterRange
                                ? 'var(--color-neutral-200)'
                                : 'transparent',
                              color: isSelected
                                ? 'var(--color-neutral-0)'
                                : 'var(--color-neutral-900)',
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected && !isInRange) {
                                e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected && !isInRange) {
                                e.currentTarget.style.backgroundColor = isInFilterRange
                                  ? 'var(--color-neutral-200)'
                                  : 'transparent'
                              }
                            }}
                          >
                            {date.getDate()}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Botões de ação */}
            {selectedStartDate && selectedEndDate && (
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedStartDate(null)
                    setSelectedEndDate(null)
                  }}
                  className="px-4 py-2 rounded transition-colors"
                  style={{
                    backgroundColor: 'var(--color-neutral-200)',
                    color: 'var(--color-neutral-900)',
                    fontSize: 'var(--font-size-label-medium)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-neutral-300)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDateRange}
                  className="px-4 py-2 rounded transition-colors"
                  style={{
                    backgroundColor: 'var(--color-brand-500)',
                    color: 'var(--color-neutral-0)',
                    fontSize: 'var(--font-size-label-medium)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-brand-600)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-brand-500)'
                  }}
                >
                  Confirmar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Date Picker Modal (Mobile) */}
        {isDatePickerOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 z-40 transition-opacity duration-300"
              style={{
                backgroundColor: 'var(--color-neutral-1100)',
                opacity: 'var(--opacity-60)',
              }}
              onClick={() => setIsDatePickerOpen(false)}
            />
            <div
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out"
              style={{
                backgroundColor: 'var(--color-neutral-0)',
                borderTopLeftRadius: 'var(--shape-20)',
                borderTopRightRadius: 'var(--shape-20)',
                padding: 'var(--space-24)',
                paddingBottom: 'var(--space-32)',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: `0 var(--shadow-offset-y-up-16) var(--shadow-blur-24) var(--shadow-spread-0) var(--shadow-color-neutral-24)`,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  style={{
                    fontSize: 'var(--font-size-heading-small)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-neutral-900)',
                  }}
                >
                  Selecionar Período
                </h2>
                <button
                  onClick={() => setIsDatePickerOpen(false)}
                  className="p-2 rounded-full transition-colors"
                  style={{
                    color: 'var(--color-neutral-600)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <Icon name="x" size={24} color="var(--color-neutral-900)" />
                </button>
              </div>

              {/* Atalhos */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => handlePeriodShortcut(getCurrentMonthRange())}
                  className="px-3 py-2 rounded transition-colors"
                  style={{
                    backgroundColor: 'var(--color-neutral-200)',
                    color: 'var(--color-neutral-900)',
                    fontSize: 'var(--font-size-label-medium)',
                  }}
                >
                  Este mês
                </button>
                <button
                  onClick={() => handlePeriodShortcut(getLastMonthRange())}
                  className="px-3 py-2 rounded transition-colors"
                  style={{
                    backgroundColor: 'var(--color-neutral-200)',
                    color: 'var(--color-neutral-900)',
                    fontSize: 'var(--font-size-label-medium)',
                  }}
                >
                  Mês passado
                </button>
                <button
                  onClick={() => handlePeriodShortcut(getLastThreeMonthsRange())}
                  className="px-3 py-2 rounded transition-colors"
                  style={{
                    backgroundColor: 'var(--color-neutral-200)',
                    color: 'var(--color-neutral-900)',
                    fontSize: 'var(--font-size-label-medium)',
                  }}
                >
                  Últimos 3 meses
                </button>
                <button
                  onClick={() => handlePeriodShortcut(getCurrentYearRange())}
                  className="px-3 py-2 rounded transition-colors"
                  style={{
                    backgroundColor: 'var(--color-neutral-200)',
                    color: 'var(--color-neutral-900)',
                    fontSize: 'var(--font-size-label-medium)',
                  }}
                >
                  Este ano
                </button>
              </div>

              {/* Calendário (1 mês no mobile) */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateMonth('prev', 1)}
                    className="p-2 rounded-full transition-colors"
                    style={{
                      color: 'var(--color-neutral-600)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <Icon name="chevron-left" size={20} color="var(--color-neutral-600)" />
                  </button>
                  <h3
                    className="font-semibold capitalize"
                    style={{
                      fontSize: 'var(--font-size-label-large)',
                      color: 'var(--color-neutral-900)',
                    }}
                  >
                    {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => navigateMonth('next', 1)}
                    className="p-2 rounded-full transition-colors"
                    style={{
                      color: 'var(--color-neutral-600)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <Icon name="chevron-right" size={20} color="var(--color-neutral-600)" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <div
                      key={day}
                      className="text-center font-medium"
                      style={{
                        color: 'var(--color-neutral-600)',
                        padding: 'var(--space-4)',
                        fontSize: 'var(--font-size-label-small)',
                      }}
                    >
                      {day}
                    </div>
                  ))}
                  {getDaysInMonth(currentMonth).map((date, dayIdx) => {
                    if (!date) {
                      return <div key={dayIdx} />
                    }
                    const isInRange = isDateInRange(date)
                    const isSelected = isDateSelected(date)
                    const isInFilterRange = isDateInFilterRange(date)
                    return (
                      <button
                        key={dayIdx}
                        onClick={() => handleDateClick(date)}
                        className="text-sm rounded transition-colors"
                        style={{
                          padding: 'var(--space-8)',
                          minHeight: 'var(--size-40)',
                          backgroundColor: isSelected
                            ? 'var(--color-brand-500)'
                            : isInRange
                            ? 'var(--color-brand-100)'
                            : isInFilterRange
                            ? 'var(--color-neutral-200)'
                            : 'transparent',
                          color: isSelected
                            ? 'var(--color-neutral-0)'
                            : 'var(--color-neutral-900)',
                        }}
                      >
                        {date.getDate()}
                      </button>
                    )
                  })}
                </div>

                {/* Botões de ação */}
                {selectedStartDate && selectedEndDate && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedStartDate(null)
                        setSelectedEndDate(null)
                      }}
                      className="flex-1 py-3 rounded-lg transition-colors"
                      style={{
                        backgroundColor: 'var(--color-neutral-200)',
                        color: 'var(--color-neutral-900)',
                        fontSize: 'var(--font-size-label-medium)',
                        fontWeight: 'var(--font-weight-semibold)',
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmDateRange}
                      className="flex-1 py-3 rounded-lg transition-colors"
                      style={{
                        backgroundColor: 'var(--color-brand-500)',
                        color: 'var(--color-neutral-0)',
                        fontSize: 'var(--font-size-label-medium)',
                        fontWeight: 'var(--font-weight-semibold)',
                      }}
                    >
                      Confirmar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Widget de Membros da Família */}
      <div className="flex items-center gap-2">
        <div className="flex items-center" style={{ marginRight: 'var(--space-8)' }}>
          {familyMembers.slice(0, 3).map((member, idx) => {
            const isSelected = filters.selectedMember === member.id
            return (
              <div
                key={member.id}
                className="relative cursor-pointer transition-all duration-200"
                style={{
                  marginLeft: idx > 0 ? 'var(--space-negative-6)' : '0',
                  zIndex: isSelected ? 10 : 3 - idx,
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                }}
                onClick={() => setSelectedMember(isSelected ? null : member.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)'
                  e.currentTarget.style.zIndex = '10'
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.zIndex = String(3 - idx)
                  }
                }}
              >
                <div
                  style={{
                    width: 'var(--size-40)',
                    height: 'var(--size-40)',
                    borderRadius: 'var(--shape-100)',
                    borderWidth: isSelected ? '3px' : '2px',
                    borderStyle: 'solid',
                    borderColor: isSelected
                      ? 'var(--color-neutral-1100)'
                      : 'var(--color-neutral-0)',
                    boxShadow: `0 var(--shadow-offset-y-down-2) var(--shadow-blur-4) var(--shadow-spread-0) var(--shadow-color-neutral-4)`,
                  }}
                >
                  <Avatar src={member.avatarUrl} alt={member.name} size="md" />
                </div>
                {isSelected && (
                  <div
                    className="absolute bottom-0 right-0 flex items-center justify-center"
                    style={{
                      width: 'var(--size-16)',
                      height: 'var(--size-16)',
                      borderRadius: 'var(--shape-100)',
                      backgroundColor: 'var(--color-green-600)',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: 'var(--color-neutral-0)',
                    }}
                  >
                    <Icon name="check" size={10} color="var(--color-neutral-0)" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <button
          className="flex items-center justify-center focus:outline-none transition-colors duration-200"
          style={{
            width: 'var(--size-40)',
            height: 'var(--size-40)',
            borderRadius: 'var(--shape-100)',
            backgroundColor: 'var(--color-brand-500)',
            color: 'var(--color-neutral-0)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-brand-600)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-brand-500)'
          }}
          aria-label="Adicionar membro"
        >
          <Icon name="plus" size={18} color="var(--color-neutral-0)" />
        </button>
      </div>

      {/* Botão Nova Transação */}
      <button
        className="flex items-center justify-center gap-2 focus:outline-none transition-colors duration-200 w-full md:w-auto"
        style={{
          height: 'var(--size-48)',
          paddingLeft: 'var(--space-16)',
          paddingRight: 'var(--space-16)',
          borderRadius: 'var(--shape-8)',
          backgroundColor: 'var(--color-neutral-1100)',
          color: 'var(--color-neutral-0)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-neutral-1000)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-neutral-1100)'
        }}
      >
        <Icon name="plus" size={20} color="var(--color-neutral-0)" />
        <span
          style={{
            fontSize: 'var(--font-size-label-medium)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-neutral-0)',
          }}
        >
          Nova Transação
        </span>
      </button>
    </div>
  )
}
