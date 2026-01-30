import { useState, useEffect, useRef } from 'react'

/**
 * Hook para animar valores numéricos de 0 até o valor final
 * @param targetValue - Valor final a ser alcançado
 * @param duration - Duração da animação em milissegundos (padrão: 800ms)
 */
export function useAnimatedValue(targetValue: number, duration: number = 800): number {
  const [animatedValue, setAnimatedValue] = useState(0)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    // Cancelar animação anterior se existir
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    if (targetValue === 0) {
      setAnimatedValue(0)
      return
    }

    const startValue = animatedValue
    const difference = targetValue - startValue
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + difference * easeOut

      setAnimatedValue(currentValue)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setAnimatedValue(targetValue)
        animationFrameRef.current = null
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animate on target/duration change only
  }, [targetValue, duration])

  return Math.round(animatedValue * 100) / 100
}
