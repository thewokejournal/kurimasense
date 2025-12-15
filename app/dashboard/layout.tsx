'use client'

import { LayoutGrid, Map, Bell } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="app-shell">
      <aside className="sidebar space-y-4">
        <div className="sidebar-icon active">
          <LayoutGrid size={20} />
        </div>

        <div className="sidebar-icon">
          <Map size={20} />
        </div>

        <div className="sidebar-icon">
          <Bell size={20} />
        </div>
      </aside>

      <main className="dashboard-main">
        {children}
      </main>
    </div>
  )
}
