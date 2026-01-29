import { useRef, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFinance } from '../../../../contexts'
import { Icon } from '../../../ui/Icon'
import { Button } from '../../../ui/Button'
import { DashboardGoalCard } from './DashboardGoalCard'
import { ROUTES } from '../../../../constants'

const CARD_WIDTH = 260
const CARD_GAP = 16

/**
 * Widget de objetivos financeiros no dashboard.
 * Carrossel de cards (um por objetivo) ou estado vazio com ícone + texto em borda pontilhada.
 */
export function FinancialGoalsWidget() {
  const { goals, filters } = useFinance()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const activeGoals = useMemo(() => {
    let list = goals.filter((g) => !g.isCompleted)
    if (filters.selectedMember) {
      list = list.filter((g) => g.memberId === filters.selectedMember)
    }
    return list
  }, [goals, filters.selectedMember])

  useEffect(() => {
    const checkScroll = () => {
      if (carouselRef.current) {
        const { scrollLeft: sl, scrollWidth, clientWidth } = carouselRef.current
        setShowLeftArrow(sl > 0)
        setShowRightArrow(sl < scrollWidth - clientWidth - 1)
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
  }, [activeGoals])

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
    const walk = (x - startX) * 2
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => setIsDragging(false)
  const handleMouseLeave = () => setIsDragging(false)

  const scrollLeftArrow = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -(CARD_WIDTH + CARD_GAP),
        behavior: 'smooth',
      })
    }
  }

  const scrollRightArrow = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: CARD_WIDTH + CARD_GAP,
        behavior: 'smooth',
      })
    }
  }

  const hasMoreThanThreeCards = activeGoals.length > 3

  return (
    <div
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
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 'var(--space-24)' }}
      >
        <div className="flex items-center" style={{ gap: 'var(--space-8)' }}>
          <Icon name="target" size={20} color="var(--color-text-primary)" />
          <h3
            style={{
              fontSize: 'var(--font-size-heading-widget)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              fontFeatureSettings: "'liga' off",
            }}
          >
            Objetivos financeiros
          </h3>
        </div>
        <Link
          to={ROUTES.GOALS}
          style={{
            fontSize: 'var(--font-size-text-body)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-action-link)',
            textDecoration: 'none',
          }}
        >
          Ver todos
        </Link>
      </div>

      {activeGoals.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center"
          style={{
            padding: 'var(--space-48)',
            borderWidth: '1px',
            borderStyle: 'dashed',
            borderColor: 'var(--color-border-default)',
            borderRadius: 'var(--shape-radius-icon)',
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--shape-radius-avatar)',
              backgroundColor: 'var(--color-background-tertiary)',
              marginBottom: 'var(--space-16)',
            }}
          >
            <Icon name="target" size={24} color="var(--color-text-tertiary)" />
          </div>
          <p
            style={{
              fontSize: 'var(--font-size-text-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Nenhum objetivo criado
          </p>
        </div>
      ) : (
        <div
          className="relative"
          style={{ width: '100%' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {showLeftArrow && (
            <div
              className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
              style={{
                width: '40px',
                background:
                  'linear-gradient(to right, var(--color-background-secondary), transparent)',
              }}
            />
          )}
          {showRightArrow && (
            <div
              className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
              style={{
                width: '40px',
                background:
                  'linear-gradient(to left, var(--color-background-secondary), transparent)',
              }}
            />
          )}

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

          <div
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide"
            style={{
              width: '100%',
              gap: 'var(--space-gap-card)',
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
            {activeGoals.map((goal) => (
              <DashboardGoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
