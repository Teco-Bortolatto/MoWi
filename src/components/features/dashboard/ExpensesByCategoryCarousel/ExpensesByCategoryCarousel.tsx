import { useRef, useState, useEffect, useMemo } from 'react'
import { useFinance } from '../../../../contexts'
import { getCurrentMonthRange } from '../../../../utils/formatDate'
import { CategoryDonutCard } from './CategoryDonutCard'
import { Button } from '../../../ui/Button'

/**
 * Todos os donuts usam brand-700 para otimizar acessibilidade
 * As cores accent (vermelho para despesas, verde para receitas) são usadas apenas em textos/valores
 */
const getCategoryColor = (): string => {
  // Todos os donuts usam brand-700 para consistência e acessibilidade
  return 'var(--color-brand-700)'
}

export function ExpensesByCategoryCarousel() {
  const { calculateExpensesByCategory, filters } = useFinance()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Calcular despesas por categoria
  const expensesByCategory = useMemo(() => {
    const startDate = filters.dateRange.startDate || getCurrentMonthRange().start
    const endDate = filters.dateRange.endDate || getCurrentMonthRange().end
    return calculateExpensesByCategory(startDate, endDate)
  }, [calculateExpensesByCategory, filters])

  // Verificar se há scroll disponível
  useEffect(() => {
    const checkScroll = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
        setShowLeftArrow(scrollLeft > 0)
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
      }
    }

    checkScroll()
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
      return () => {
        carousel.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [expensesByCategory])

  // Mouse wheel horizontal
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault()
        carousel.scrollLeft += e.deltaY
      }
    }

    carousel.addEventListener('wheel', handleWheel, { passive: false })
    return () => carousel.removeEventListener('wheel', handleWheel)
  }, [])

  // Drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2 // Velocidade do scroll
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Navegação com setas
  const scrollLeftArrow = () => {
    if (carouselRef.current) {
      const cardWidth = 214 // --size-card-donut-width
      const gap = 16 // --space-gap-card
      const scrollAmount = cardWidth + gap
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
  }

  const scrollRightArrow = () => {
    if (carouselRef.current) {
      const cardWidth = 214 // --size-card-donut-width
      const gap = 16 // --space-gap-card
      const scrollAmount = cardWidth + gap
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  // Verificar se há mais de 3 cards (para mostrar botão lateral)
  const hasMoreThanThreeCards = expensesByCategory.length > 3
  const isEmpty = expensesByCategory.length === 0

  // Estado vazio: skeleton donut + legenda para indicar onde fica o Carrossel de Gastos por Categoria
  if (isEmpty) {
    const size = 131
    const innerDiameter = 97.09
    const strokeWidth = size / 2 - innerDiameter / 2
    const center = size / 2

    return (
      <div
        className="relative"
        style={{ width: '100%' }}
        aria-label="Gastos por categoria (nenhuma categoria de gasto criada)"
      >
        <div
          className="flex overflow-x-auto scrollbar-hide"
          style={{
            width: '100%',
            gap: 'var(--space-gap-card)',
            paddingRight: 'var(--space-layout-component)',
          }}
        >
          <div
            className="flex flex-col items-center justify-center flex-shrink-0"
            style={{
              width: 'var(--size-card-donut-width)',
              padding: 'var(--space-padding-card)',
              backgroundColor: 'var(--color-background-card)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border-card)',
              borderRadius: 'var(--shape-radius-card)',
            }}
          >
            {/* Skeleton donut (anel vazio) */}
            <div
              className="relative flex items-center justify-center"
              style={{
                marginBottom: 'var(--space-32)',
                width: size,
                height: size,
              }}
            >
              <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden>
                <circle
                  cx={center}
                  cy={center}
                  r={center - strokeWidth / 2}
                  fill="none"
                  stroke="var(--color-background-tertiary)"
                  strokeWidth={strokeWidth}
                />
              </svg>
            </div>
            <p
              style={{
                fontSize: 'var(--font-size-text-label)',
                fontWeight: 'var(--font-weight-bold)',
                lineHeight: 'var(--font-line-height-default)',
                color: 'var(--color-text-tertiary)',
                textAlign: 'center',
                fontFeatureSettings: "'liga' off",
              }}
            >
              Nenhuma categoria de gasto criada
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative"
      style={{
        width: '100%',
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradiente fade esquerdo - só aparece quando há scroll para a esquerda */}
      {showLeftArrow && (
        <div
          className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
          style={{
            width: '40px',
            background: 'linear-gradient(to right, var(--color-background-secondary), transparent)',
          }}
        />
      )}

      {/* Gradiente fade direito - só aparece quando há scroll para a direita */}
      {showRightArrow && (
        <div
          className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
          style={{
            width: '40px',
            background: 'linear-gradient(to left, var(--color-neutral-100), transparent)',
          }}
        />
      )}

      {/* Setas de navegação (apenas desktop e quando hover) */}
      {isHovered && showLeftArrow && (
        <Button
          onClick={scrollLeftArrow}
          variant="tertiary"
          size="small"
          icon="chevron-left"
          iconOnly
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20"
          style={{ boxShadow: 'var(--shadow-card-hover)' }}
          aria-label="Scroll esquerda"
        />
      )}

      {/* Botão lateral direito (centralizado) - aparece quando há mais de 3 cards no desktop */}
      {hasMoreThanThreeCards && showRightArrow && (
        <Button
          onClick={scrollRightArrow}
          variant="tertiary"
          size="small"
          icon="chevron-right"
          iconOnly
          className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-20"
          style={{
            boxShadow: 'var(--shadow-card-hover)',
            marginRight: 'var(--space-layout-component)',
          }}
          aria-label="Scroll direita"
        />
      )}

      {/* Carrossel */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide expenses-carousel-desktop"
        style={{
          width: '100%',
          gap: 'var(--space-gap-card)',
          paddingLeft: '0px',
          paddingRight: 'var(--space-layout-component)',
          scrollBehavior: 'smooth',
          cursor: isDragging ? 'grabbing' : 'grab',
          WebkitOverflowScrolling: 'touch',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {expensesByCategory.map((expense) => (
          <CategoryDonutCard
            key={expense.category}
            category={expense.category}
            amount={expense.amount}
            percentage={expense.percentage}
            color={getCategoryColor()}
          />
        ))}
      </div>
    </div>
  )
}
