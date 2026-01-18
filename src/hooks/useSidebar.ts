import { useState } from 'react'

const SIDEBAR_STORAGE_KEY = 'mycash-sidebar-expanded'

export function useSidebar() {
  const [isExpanded, setIsExpanded] = useState(() => {
    // Tenta recuperar do localStorage, padrão: expandido
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    return stored ? JSON.parse(stored) : true
  })

  const toggle = () => {
    setIsExpanded((prev: boolean) => {
      const newValue = !prev
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(newValue))
      return newValue
    })
  }

  const expand = () => {
    setIsExpanded(true)
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(true))
  }

  const collapse = () => {
    setIsExpanded(false)
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(false))
  }

  return {
    isExpanded,
    toggle,
    expand,
    collapse,
  }
}
