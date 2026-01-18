import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <Sidebar />
      <main className="flex-1 w-full min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
