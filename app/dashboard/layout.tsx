'use client'

import { LayoutDashboard, Map } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import HeaderBar from '@/components/layout/HeaderBar'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/fields', icon: Map, label: 'Fields' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || (href === '/dashboard' && pathname?.startsWith('/dashboard'))

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">KurimaSense</div>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${isActive(href) ? 'active' : ''}`}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      
      <div className="dashboard-main-wrapper">
        <HeaderBar />
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  )
}
