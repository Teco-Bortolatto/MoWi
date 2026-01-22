import { useState, useRef, useEffect, Fragment } from 'react'
import { useFinance } from '../../../../contexts'
import { Icon } from '../../../ui/Icon'
import { Avatar } from '../../../ui/Avatar'
import { Button } from '../../../ui/Button'
import { NewTransactionModal } from '../../../modals/NewTransactionModal'
import { NewFamilyMemberModal } from '../../../modals/NewFamilyMemberModal'
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
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false)
  const [isNewFamilyMemberModalOpen, setIsNewFamilyMemberModalOpen] = useState(false)
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

  // Shared components for filter popover and date picker modals
  const FilterPopover = () => (
    <>
      {/* Filter Popover (Desktop/Tablet) */}
      {isFilterPopoverOpen && (
        <div
          className="hidden md:block absolute top-full mt-2 z-50"
          style={{
            right: 0,
            minWidth: '280px',
            padding: 'var(--space-layout-component)',
            borderRadius: 'var(--shape-radius-icon)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: 'var(--shadow-card-elevated)',
          }}
        >
          <div>
            <p
              style={{
                fontSize: 'var(--font-size-text-label)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-margin-component)',
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
                    padding: 'var(--space-padding-button-small)',
                    borderRadius: 'var(--shape-radius-icon)',
                    backgroundColor:
                      filters.transactionType === type
                        ? 'var(--color-background-action-primary)'
                        : 'transparent',
                    color:
                      filters.transactionType === type
                        ? 'var(--color-text-on-action-primary)'
                        : 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-text-label)',
                  }}
                  onMouseEnter={(e) => {
                    if (filters.transactionType !== type) {
                      e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
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
              backgroundColor: 'var(--color-background-action-primary)',
              opacity: 'var(--opacity-60)',
            }}
            onClick={() => setIsFilterPopoverOpen(false)}
          />
          <div
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out"
            style={{
              backgroundColor: 'var(--color-background-surface)',
              borderTopLeftRadius: 'var(--shape-radius-modal)',
              borderTopRightRadius: 'var(--shape-radius-modal)',
              padding: 'var(--space-padding-modal)',
              paddingBottom: 'var(--space-layout-container)',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-card-elevated)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                style={{
                  fontSize: 'var(--font-size-heading-section)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Filtros
              </h2>
              <button
                onClick={() => setIsFilterPopoverOpen(false)}
                className="p-2 rounded-full transition-colors"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Icon name="x" size={24} color="var(--color-text-primary)" />
              </button>
            </div>
            <div>
              <p
                style={{
                  fontSize: 'var(--font-size-text-label)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-margin-component)',
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
                      padding: 'var(--space-gap-component)',
                      borderRadius: 'var(--shape-radius-icon)',
                      backgroundColor:
                        filters.transactionType === type
                          ? 'var(--color-background-action-primary)'
                          : 'var(--color-background-tertiary)',
                      color:
                        filters.transactionType === type
                          ? 'var(--color-text-on-action-primary)'
                          : 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-text-label)',
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
    </>
  )

  const DatePickerModal = () => (
    <>
      {/* Date Picker (Desktop/Tablet - 2 meses) */}
      {isDatePickerOpen && (
        <div
          className="hidden md:block absolute top-full mt-2 z-50"
          style={{
            right: 0,
            padding: 'var(--space-layout-component)',
            borderRadius: 'var(--shape-radius-icon)',
            backgroundColor: 'var(--color-background-surface)',
            boxShadow: 'var(--shadow-card-elevated)',
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
                backgroundColor: 'var(--color-background-tertiary)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-text-label)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background-surface-active)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
              }}
            >
              Este mês
            </button>
            <button
              onClick={() => handlePeriodShortcut(getLastMonthRange())}
              className="px-3 py-1.5 rounded transition-colors"
              style={{
                backgroundColor: 'var(--color-background-tertiary)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-text-label)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background-surface-active)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
              }}
            >
              Mês passado
            </button>
            <button
              onClick={() => handlePeriodShortcut(getLastThreeMonthsRange())}
              className="px-3 py-1.5 rounded transition-colors"
              style={{
                backgroundColor: 'var(--color-background-tertiary)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-text-label)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background-surface-active)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
              }}
            >
              Últimos 3 meses
            </button>
            <button
              onClick={() => handlePeriodShortcut(getCurrentYearRange())}
              className="px-3 py-1.5 rounded transition-colors"
              style={{
                backgroundColor: 'var(--color-background-tertiary)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-text-label)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background-surface-active)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
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
                        color: 'var(--color-text-secondary)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <Icon name="chevron-left" size={16} color="var(--color-text-secondary)" />
                    </button>
                    <h3
                      className="font-semibold capitalize"
                      style={{
                        fontSize: 'var(--font-size-text-label)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {monthName}
                    </h3>
                    <button
                      onClick={() => navigateMonth('next', idx === 0 ? 1 : 2)}
                      className="p-1 rounded transition-colors"
                      style={{
                        color: 'var(--color-text-secondary)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <Icon name="chevron-right" size={16} color="var(--color-text-secondary)" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7" style={{ gap: '4px' }}>
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                      <div
                        key={day}
                        className="text-center font-medium"
                        style={{
                          color: 'var(--color-text-secondary)',
                          padding: 'var(--space-gap-tight)',
                          fontSize: 'var(--font-size-text-caption)',
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
                            padding: 'var(--space-gap-tight)',
                            minHeight: 'var(--size-button-height-small)',
                            backgroundColor: isSelected
                              ? 'var(--color-background-action-primary)'
                              : isInRange
                              ? 'var(--color-background-sidebar-active)'
                              : isInFilterRange
                              ? 'var(--color-background-tertiary)'
                              : 'transparent',
                            color: isSelected
                              ? 'var(--color-text-on-action-primary)'
                              : 'var(--color-text-primary)',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected && !isInRange) {
                              e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected && !isInRange) {
                              e.currentTarget.style.backgroundColor = isInFilterRange
                                ? 'var(--color-background-tertiary)'
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
                  backgroundColor: 'var(--color-background-tertiary)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-text-label)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-background-surface-active)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDateRange}
                className="px-4 py-2 rounded transition-colors"
                style={{
                  backgroundColor: 'var(--color-background-action-secondary)',
                  color: 'var(--color-text-action-link)',
                  fontSize: 'var(--font-size-text-label)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--color-border-button-action)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-background-action-secondary-hover)'
                  e.currentTarget.style.color = 'var(--color-text-action-link-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-background-action-secondary)'
                  e.currentTarget.style.color = 'var(--color-text-action-link)'
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
              backgroundColor: 'var(--color-background-action-primary)',
              opacity: 'var(--opacity-60)',
            }}
            onClick={() => setIsDatePickerOpen(false)}
          />
          <div
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out"
            style={{
              backgroundColor: 'var(--color-background-surface)',
              borderTopLeftRadius: 'var(--shape-radius-modal)',
              borderTopRightRadius: 'var(--shape-radius-modal)',
              padding: 'var(--space-padding-modal)',
              paddingBottom: 'var(--space-layout-container)',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-card-elevated)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                style={{
                  fontSize: 'var(--font-size-heading-section)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Selecionar Período
              </h2>
              <button
                onClick={() => setIsDatePickerOpen(false)}
                className="p-2 rounded-full transition-colors"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Icon name="x" size={24} color="var(--color-text-primary)" />
              </button>
            </div>

            {/* Atalhos */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => handlePeriodShortcut(getCurrentMonthRange())}
                className="px-3 py-2 rounded transition-colors"
                style={{
                  backgroundColor: 'var(--color-background-tertiary)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-text-label)',
                }}
              >
                Este mês
              </button>
              <button
                onClick={() => handlePeriodShortcut(getLastMonthRange())}
                className="px-3 py-2 rounded transition-colors"
                style={{
                  backgroundColor: 'var(--color-background-tertiary)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-text-label)',
                }}
              >
                Mês passado
              </button>
              <button
                onClick={() => handlePeriodShortcut(getLastThreeMonthsRange())}
                className="px-3 py-2 rounded transition-colors"
                style={{
                  backgroundColor: 'var(--color-background-tertiary)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-text-label)',
                }}
              >
                Últimos 3 meses
              </button>
              <button
                onClick={() => handlePeriodShortcut(getCurrentYearRange())}
                className="px-3 py-2 rounded transition-colors"
                style={{
                  backgroundColor: 'var(--color-background-tertiary)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-text-label)',
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
                    color: 'var(--color-text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <Icon name="chevron-left" size={20} color="var(--color-text-secondary)" />
                </button>
                <h3
                  className="font-semibold capitalize"
                  style={{
                    fontSize: 'var(--font-size-heading-label)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => navigateMonth('next', 1)}
                  className="p-2 rounded-full transition-colors"
                  style={{
                    color: 'var(--color-text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <Icon name="chevron-right" size={20} color="var(--color-text-secondary)" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div
                    key={day}
                    className="text-center font-medium"
                    style={{
                      color: 'var(--color-text-secondary)',
                      padding: 'var(--space-gap-tight)',
                      fontSize: 'var(--font-size-text-caption)',
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
                        padding: 'var(--space-layout-element)',
                        minHeight: 'var(--size-input-height-small)',
                        backgroundColor: isSelected
                          ? 'var(--color-background-action-primary)'
                          : isInRange
                          ? 'var(--color-background-sidebar-active)'
                          : isInFilterRange
                          ? 'var(--color-background-tertiary)'
                          : 'transparent',
                        color: isSelected
                          ? 'var(--color-text-on-action-primary)'
                          : 'var(--color-text-primary)',
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
                      backgroundColor: 'var(--color-background-tertiary)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-text-label)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmDateRange}
                    className="flex-1 py-3 rounded-lg transition-colors"
                    style={{
                      backgroundColor: 'var(--color-background-action-primary)',
                      color: 'var(--color-text-on-action-primary)',
                      fontSize: 'var(--font-size-text-label)',
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
    </>
  )

  // Profile avatars component - overlapping for mobile/tablet, spaced for desktop
  const ProfileAvatars = ({ overlapping = false }: { overlapping?: boolean }) => (
    <div 
      className="flex items-center flex-shrink-0" 
      style={{ 
        gap: overlapping ? '0px' : '8px',
        marginRight: '0px', 
        justifyContent: 'flex-start' 
      }}
    >
      {familyMembers.slice(0, 3).map((member, idx) => {
        const isSelected = filters.selectedMember === member.id
        return (
          <Fragment key={member.id}>
            <div
              className="relative cursor-pointer transition-all duration-200"
              style={{
                zIndex: isSelected ? 10 : 3 - idx,
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                marginLeft: overlapping && idx > 0 ? '-16px' : idx > 0 ? '0px' : '0',
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
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: '#FFFFFF',
                  backgroundColor: isSelected
                    ? 'var(--color-background-action-primary)'
                    : 'var(--color-background-surface)',
                  boxShadow: 'var(--shadow-elevation-1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar src={member.avatarUrl} alt={member.name} size="md" />
                </div>
              </div>
              {isSelected && (
                <div
                  className="absolute bottom-0 right-0 flex items-center justify-center"
                  style={{
                    width: 'var(--size-icon-small)',
                    height: 'var(--size-icon-small)',
                    borderRadius: 'var(--shape-100)',
                    backgroundColor: 'var(--color-text-success)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: '#FFFFFF',
                  }}
                >
                  <Icon name="check" size={10} color="var(--color-text-on-dark)" />
                </div>
              )}
            </div>
          </Fragment>
        )
      })}
    </div>
  )

  return (
    <>
      <div
        className="w-full"
        style={{
          paddingTop: 'var(--space-layout-component)',
          paddingBottom: 'var(--space-layout-section)',
          paddingLeft: '0px',
          paddingRight: '0px',
          width: '100%',
        }}
      >
        {/* ========== MOBILE HEADER (< 768px) ========== */}
        <div className="md:hidden flex flex-col" style={{ gap: '16px' }}>
          {/* Line 1: Search + Filter */}
          <div className="flex flex-row items-center" style={{ gap: 'var(--space-layout-component)' }}>
            {/* Search Input */}
            <div className="relative flex-1" style={{ minWidth: 0 }}>
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none flex items-center"
                style={{ left: 'var(--space-layout-section)', width: 'var(--size-icon-small)', height: 'var(--size-icon-small)' }}
              >
                <Icon name="search" size={16} color="var(--color-text-secondary)" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar"
                value={filters.searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full focus:outline-none"
                style={{
                  height: 'var(--size-input-search-height)',
                  paddingLeft: 'calc(var(--space-padding-input) + var(--size-icon-small) + var(--space-layout-element))',
                  paddingRight: 'var(--space-layout-section)',
                  paddingTop: 'var(--space-layout-component)',
                  paddingBottom: 'var(--space-layout-component)',
                  borderRadius: 'var(--shape-radius-search)',
                  backgroundColor: 'var(--color-background-input-default)',
                  borderColor: 'var(--color-border-input-default)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  fontSize: 'var(--font-size-input-medium)',
                  lineHeight: 'var(--font-line-height-default)',
                  letterSpacing: '0.3px',
                  color: 'var(--color-text-primary)',
                  width: '100%',
                }}
              />
            </div>

            {/* Filter Button */}
            <div className="relative" ref={filterPopoverRef}>
              <button
                onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
                className="flex items-center justify-center focus:outline-none transition-colors duration-200 flex-shrink-0"
                style={{
                  width: '40px',
                  height: '40px',
                  paddingTop: 'var(--space-layout-component)',
                  paddingBottom: 'var(--space-layout-component)',
                  paddingLeft: 'var(--space-layout-element)',
                  paddingRight: 'var(--space-layout-element)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--color-border-button-action)',
                  borderRadius: '80px',
                }}
                aria-label="Filtros"
              >
                <Icon name="filter" size={16} color="var(--color-text-action-link)" />
              </button>
              <FilterPopover />
            </div>
          </div>

          {/* Line 2: Date Picker + Add Profile Button + Profiles */}
          <div className="flex flex-row items-center" style={{ gap: '8px' }}>
            {/* Date Picker */}
            <div className="relative flex-1" ref={datePickerRef} style={{ minWidth: 0 }}>
              <button
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="flex items-center gap-2 focus:outline-none transition-colors duration-200 whitespace-nowrap w-full"
                style={{
                  height: '56px',
                  paddingLeft: 'var(--space-layout-section)',
                  paddingRight: 'var(--space-layout-section)',
                  paddingTop: 'var(--space-layout-component)',
                  paddingBottom: 'var(--space-layout-component)',
                  borderRadius: 'var(--shape-radius-button)',
                  backgroundColor: 'var(--color-background-input-hover)',
                  borderColor: 'var(--color-border-input-focus)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  gap: 'var(--space-layout-element)',
                }}
              >
                <Icon name="calendar" size={16} color="var(--color-text-primary)" />
                <span
                  style={{
                    fontSize: 'var(--font-size-text-label)',
                    fontWeight: 'var(--font-weight-bold)',
                    lineHeight: 'var(--font-line-height-default)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  Data
                </span>
              </button>
              <DatePickerModal />
            </div>

            {/* Add Profile Button */}
            <Button
              onClick={() => setIsNewFamilyMemberModalOpen(true)}
              variant="tertiary"
              size="large"
              icon="plus"
              iconOnly
              aria-label="Adicionar membro"
              style={{ height: '40px', width: '40px', minWidth: '40px', flexShrink: 0 }}
            />

            {/* Profiles (overlapping) */}
            <ProfileAvatars overlapping={true} />
          </div>

          {/* Line 3: New Transaction Button (full width) */}
          <Button
            onClick={() => setIsNewTransactionModalOpen(true)}
            variant="primary"
            size="medium"
            icon="plus"
            className="whitespace-nowrap w-full"
            style={{ 
              paddingTop: '16px',
              paddingBottom: '16px',
            }}
          >
            Nova Transação
          </Button>
        </div>

        {/* ========== TABLET HEADER (≥ 768px and < 1280px) ========== */}
        <div className="hidden md:flex lg:hidden flex-row items-center" style={{ gap: '32px', width: '100%' }}>
          {/* Group: Search + Filter (8px gap) */}
          <div className="flex flex-row items-center flex-1" style={{ gap: '8px', minWidth: 0 }}>
            {/* Search Input */}
            <div className="relative flex-1" style={{ minWidth: 0 }}>
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none flex items-center"
                style={{ left: 'var(--space-layout-section)', width: 'var(--size-icon-small)', height: 'var(--size-icon-small)' }}
              >
                <Icon name="search" size={16} color="var(--color-text-secondary)" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar"
                value={filters.searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full focus:outline-none"
                style={{
                  height: 'var(--size-input-search-height)',
                  paddingLeft: 'calc(var(--space-padding-input) + var(--size-icon-small) + var(--space-layout-element))',
                  paddingRight: 'var(--space-layout-section)',
                  paddingTop: 'var(--space-layout-component)',
                  paddingBottom: 'var(--space-layout-component)',
                  borderRadius: 'var(--shape-radius-search)',
                  backgroundColor: 'var(--color-background-input-default)',
                  borderColor: 'var(--color-border-input-default)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  fontSize: 'var(--font-size-input-medium)',
                  lineHeight: 'var(--font-line-height-default)',
                  letterSpacing: '0.3px',
                  color: 'var(--color-text-primary)',
                  width: '100%',
                }}
              />
            </div>

            {/* Filter Button */}
            <div className="relative" ref={filterPopoverRef}>
              <button
                onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
                className="flex items-center justify-center focus:outline-none transition-colors duration-200 flex-shrink-0"
                style={{
                  width: '40px',
                  height: '40px',
                  paddingTop: 'var(--space-layout-component)',
                  paddingBottom: 'var(--space-layout-component)',
                  paddingLeft: 'var(--space-layout-element)',
                  paddingRight: 'var(--space-layout-element)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--color-border-button-action)',
                  borderRadius: '80px',
                }}
                aria-label="Filtros"
              >
                <Icon name="filter" size={16} color="var(--color-text-action-link)" />
              </button>
              <FilterPopover />
            </div>
          </div>

          {/* Date Picker */}
          <div className="relative" ref={datePickerRef} style={{ flexShrink: 0 }}>
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="flex items-center gap-2 focus:outline-none transition-colors duration-200 whitespace-nowrap"
              style={{
                height: '56px',
                paddingLeft: 'var(--space-layout-section)',
                paddingRight: 'var(--space-layout-section)',
                paddingTop: 'var(--space-layout-component)',
                paddingBottom: 'var(--space-layout-component)',
                borderRadius: 'var(--shape-radius-button)',
                backgroundColor: 'var(--color-background-input-hover)',
                borderColor: 'var(--color-border-input-focus)',
                borderWidth: '1px',
                borderStyle: 'solid',
                gap: 'var(--space-layout-element)',
              }}
            >
              <Icon name="calendar" size={16} color="var(--color-text-primary)" />
              <span
                style={{
                  fontSize: 'var(--font-size-text-label)',
                  fontWeight: 'var(--font-weight-bold)',
                  lineHeight: 'var(--font-line-height-default)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {formatCurrentPeriod()}
              </span>
            </button>
            <DatePickerModal />
          </div>

          {/* Group: Add Profile Button + Profiles (overlapping) */}
          <div className="flex flex-row items-center flex-shrink-0" style={{ gap: '8px' }}>
            {/* Add Profile Button */}
            <Button
              onClick={() => setIsNewFamilyMemberModalOpen(true)}
              variant="tertiary"
              size="large"
              icon="plus"
              iconOnly
              aria-label="Adicionar membro"
              style={{ height: '40px', width: '40px', minWidth: '40px', flexShrink: 0 }}
            />

            {/* Profiles (overlapping) */}
            <ProfileAvatars overlapping={true} />
          </div>

          {/* New Transaction Button (fit-content) */}
          <Button
            onClick={() => setIsNewTransactionModalOpen(true)}
            variant="primary"
            size="medium"
            icon="plus"
            className="whitespace-nowrap"
            style={{ 
              flexShrink: 0,
              paddingTop: '16px',
              paddingBottom: '16px',
            }}
          >
            Nova Transação
          </Button>
        </div>

        {/* ========== DESKTOP HEADER (≥ 1280px) ========== */}
        <div className="hidden lg:flex flex-row items-center" style={{ gap: '40px', width: '100%' }}>
          {/* Group: Search + Filter (8px gap) */}
          <div className="flex flex-row items-center flex-1" style={{ gap: '8px', minWidth: 0 }}>
            {/* Search Input */}
            <div className="relative flex-1" style={{ minWidth: 0 }}>
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none flex items-center"
                style={{ left: 'var(--space-layout-section)', width: 'var(--size-icon-small)', height: 'var(--size-icon-small)' }}
              >
                <Icon name="search" size={16} color="var(--color-text-secondary)" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar"
                value={filters.searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full focus:outline-none"
                style={{
                  height: 'var(--size-input-search-height)',
                  paddingLeft: 'calc(var(--space-padding-input) + var(--size-icon-small) + var(--space-layout-element))',
                  paddingRight: 'var(--space-layout-section)',
                  paddingTop: 'var(--space-layout-component)',
                  paddingBottom: 'var(--space-layout-component)',
                  borderRadius: 'var(--shape-radius-search)',
                  backgroundColor: 'var(--color-background-input-default)',
                  borderColor: 'var(--color-border-input-default)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  fontSize: 'var(--font-size-input-medium)',
                  lineHeight: 'var(--font-line-height-default)',
                  letterSpacing: '0.3px',
                  color: 'var(--color-text-primary)',
                  width: '100%',
                }}
              />
            </div>

            {/* Filter Button */}
            <div className="relative" ref={filterPopoverRef}>
              <button
                onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
                className="flex items-center justify-center focus:outline-none transition-colors duration-200 flex-shrink-0"
                style={{
                  width: '40px',
                  height: '40px',
                  paddingTop: 'var(--space-layout-component)',
                  paddingBottom: 'var(--space-layout-component)',
                  paddingLeft: 'var(--space-layout-element)',
                  paddingRight: 'var(--space-layout-element)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--color-border-button-action)',
                  borderRadius: '80px',
                }}
                aria-label="Filtros"
              >
                <Icon name="filter" size={16} color="var(--color-text-action-link)" />
              </button>
              <FilterPopover />
            </div>
          </div>

          {/* Date Picker */}
          <div className="relative" ref={datePickerRef} style={{ flexShrink: 0 }}>
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="flex items-center gap-2 focus:outline-none transition-colors duration-200 whitespace-nowrap"
              style={{
                height: '56px',
                paddingLeft: 'var(--space-layout-section)',
                paddingRight: 'var(--space-layout-section)',
                paddingTop: 'var(--space-layout-component)',
                paddingBottom: 'var(--space-layout-component)',
                borderRadius: 'var(--shape-radius-button)',
                backgroundColor: 'var(--color-background-input-hover)',
                borderColor: 'var(--color-border-input-focus)',
                borderWidth: '1px',
                borderStyle: 'solid',
                gap: 'var(--space-layout-element)',
              }}
            >
              <Icon name="calendar" size={16} color="var(--color-text-primary)" />
              <span
                style={{
                  fontSize: 'var(--font-size-text-label)',
                  fontWeight: 'var(--font-weight-bold)',
                  lineHeight: 'var(--font-line-height-default)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {formatCurrentPeriod()}
              </span>
            </button>
            <DatePickerModal />
          </div>

          {/* Group: Add Profile Button + Profiles (NOT overlapping, 8px gap) */}
          <div className="flex flex-row items-center flex-shrink-0" style={{ gap: '8px' }}>
            {/* Add Profile Button */}
            <Button
              onClick={() => setIsNewFamilyMemberModalOpen(true)}
              variant="tertiary"
              size="large"
              icon="plus"
              iconOnly
              aria-label="Adicionar membro"
              style={{ height: '40px', width: '40px', minWidth: '40px', flexShrink: 0 }}
            />

            {/* Profiles (NOT overlapping, 8px gap) */}
            <ProfileAvatars overlapping={false} />
          </div>

          {/* New Transaction Button (fit-content) */}
          <Button
            onClick={() => setIsNewTransactionModalOpen(true)}
            variant="primary"
            size="medium"
            icon="plus"
            className="whitespace-nowrap"
            style={{ 
              flexShrink: 0,
              paddingTop: '16px',
              paddingBottom: '16px',
            }}
          >
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Modal Nova Transação */}
      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
      />

      {/* Modal Novo Familiar */}
      <NewFamilyMemberModal
        isOpen={isNewFamilyMemberModalOpen}
        onClose={() => setIsNewFamilyMemberModalOpen(false)}
      />
    </>
  )
}
