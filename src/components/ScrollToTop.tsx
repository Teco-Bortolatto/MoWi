import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Componente que garante que a página sempre comece do topo
 * ao navegar entre rotas ou dar refresh
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Desabilitar scroll restoration automático do navegador
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    // Scroll para o topo sempre que a rota mudar
    // Usar múltiplos timeouts para garantir que funcione após o carregamento completo
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior
      })
      
      // Também garantir que o elemento root e main estejam no topo
      const root = document.documentElement || document.body
      if (root) {
        root.scrollTop = 0
      }
      
      const main = document.querySelector('main')
      if (main) {
        main.scrollTop = 0
      }
    }

    // Executar imediatamente
    scrollToTop()

    // Executar após múltiplos delays para garantir que funcione
    const timeoutIds = [
      setTimeout(scrollToTop, 0),
      setTimeout(scrollToTop, 50),
      setTimeout(scrollToTop, 100),
      setTimeout(scrollToTop, 200),
    ]

    // Executar após o próximo frame de renderização
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTop)
    })

    return () => {
      timeoutIds.forEach(id => clearTimeout(id))
    }
  }, [pathname])

  // Também garantir scroll no mount inicial
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior
      })
      
      const root = document.documentElement || document.body
      if (root) {
        root.scrollTop = 0
      }
      
      const main = document.querySelector('main')
      if (main) {
        main.scrollTop = 0
      }
    }

    scrollToTop()
    const timeoutId = setTimeout(scrollToTop, 100)
    
    return () => clearTimeout(timeoutId)
  }, [])

  return null
}
