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
    const timeoutIds = [
      setTimeout(scrollToTop, 0),
      setTimeout(scrollToTop, 50),
      setTimeout(scrollToTop, 100),
    ]

    let rafId1: number | null = null
    let rafId2: number | null = null
    rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(scrollToTop)
    })

    return () => {
      timeoutIds.forEach(id => clearTimeout(id))
      if (rafId1 !== null) cancelAnimationFrame(rafId1)
      if (rafId2 !== null) cancelAnimationFrame(rafId2)
    }
  }, [])

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar - apenas desktop (≥1280px) */}
      <Sidebar />
      
      {/* Header Mobile - apenas mobile/tablet (<1280px) */}
      <HeaderMobile />
      
      <main className="flex-1 w-full min-w-0 px-16">
        <Outlet />
      </main>
    </div>
  )
}
