import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import './styles/globals.css'

// Desabilitar scroll restoration automático do navegador
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

// Garantir que a página comece do topo ao carregar (uma vez, sem timers que atrasem unload)
const scrollToTop = () => {
  window.scrollTo(0, 0)
  const root = document.documentElement ?? document.body
  if (root) root.scrollTop = 0
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scrollToTop, { once: true })
} else {
  scrollToTop()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
