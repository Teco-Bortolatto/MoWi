import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary para evitar tela em branco quando algum erro não tratado ocorre.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center p-6 bg-neutral-100"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-neutral-200">
            <h1 className="text-lg font-bold text-neutral-900 mb-2">
              Algo deu errado
            </h1>
            <p className="text-sm text-neutral-600 mb-4">
              {this.state.error.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Recarregar a página
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
