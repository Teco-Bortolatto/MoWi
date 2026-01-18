import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FinanceProvider } from './contexts'
import { Layout } from './components/layout'
import DashboardPage from './pages/DashboardPage'
import CardsPage from './pages/CardsPage'
import TransactionsPage from './pages/TransactionsPage'
import ProfilePage from './pages/ProfilePage'
import GoalsPage from './pages/GoalsPage'

function App() {
  return (
    <FinanceProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </FinanceProvider>
  )
}

export default App
