import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { FinanceProvider } from './contexts'
import { Layout } from './components/layout'
import { ScrollToTop } from './components/ScrollToTop'
import { useAuth } from './hooks/useAuth'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const CardsPage = lazy(() => import('./pages/CardsPage'))
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const GoalsPage = lazy(() => import('./pages/GoalsPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/*"
          element={
            <PrivateRoute>
              <FinanceProvider>
                <Layout />
              </FinanceProvider>
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="cards" element={<CardsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
