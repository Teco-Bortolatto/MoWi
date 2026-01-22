import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { HeaderMobile } from './HeaderMobile'

export function Layout() {
  // Garantir que a página comece no topo ao montar
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
    
    // Executar após múltiplos delays para garantir
    const timeoutIds = [
      setTimeout(scrollToTop, 0),
      setTimeout(scrollToTop, 50),
      setTimeout(scrollToTop, 100),
    ]

    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTop)
    })

    return () => {
      timeoutIds.forEach(id => clearTimeout(id))
    }
  }, [])

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar - apenas desktop (≥1280px) */}
      <Sidebar />
      
      {/* Header Mobile - apenas mobile/tablet (<1280px) */}
      <HeaderMobile />
      
      <main className="flex-1 w-full min-w-0 px-2 md:px-6">
        <Outlet />
      </main>
    </div>
  )
}
