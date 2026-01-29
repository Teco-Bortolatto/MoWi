import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import './styles/globals.css'

// Desabilitar scroll restoration automático do navegador
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

// Garantir que a página comece do topo ao carregar
// Executar múltiplas vezes para garantir que funcione
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant' as ScrollBehavior
  })
  
  // Também garantir que o elemento root esteja no topo
  const root = document.documentElement || document.body
  if (root) {
    root.scrollTop = 0
  }
}

// Executar imediatamente
scrollToTop()

// Executar após o DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scrollToTop)
} else {
  scrollToTop()
}

// Executar após um pequeno delay para garantir que tudo esteja renderizado
setTimeout(scrollToTop, 0)
setTimeout(scrollToTop, 100)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
