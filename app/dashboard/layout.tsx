'use client'

import { Home, Map, Layers, Settings, LayoutDashboard, Folder, User, FileText, Users, Building, MessageSquare, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import HeaderBar from '@/components/layout/HeaderBar'
import RightSidebar from '@/components/layout/RightSidebar'

const favorites = [
  { href: '/dashboard', icon: Home, label: 'Overview' },
  { href: '/fields', icon: Folder, label: 'Projects' },
]

const dashboards = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/fields', icon: Folder, label: 'Projects' },
]

const pages = [
  { href: '/dashboard', icon: User, label: 'User Profile' },
  { href: '/dashboard', icon: Home, label: 'Overview' },
  { href: '/fields', icon: Folder, label: 'Projects' },
  { href: '/analytics', icon: Layers, label: 'Campaigns' },
  { href: '/dashboard', icon: FileText, label: 'Documents' },
  { href: '/dashboard', icon: Users, label: 'Followers' },
]

const otherSections = [
  { href: '/dashboard', icon: Users, label: 'Account' },
  { href: '/dashboard', icon: Building, label: 'Corporate' },
  { href: '/dashboard', icon: FileText, label: 'Blog' },
  { href: '/dashboard', icon: MessageSquare, label: 'Social' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <div className="flex min-h-screen bg-transparent">
      <aside className="sidebar-new">
        <div className="sidebar-inner">
          <div className="sidebar-logo-section">
            <div className="logo-mark-new">K</div>
            <span className="logo-text-new">KurimaSense</span>
          </div>
          
          <nav className="sidebar-nav-content">
            <div className="nav-section">
              <div className="nav-section-label">Favorites</div>
              <div className="nav-section-items">
                {favorites.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`nav-item ${isActive(href) ? 'active' : ''}`}
                  >
                    <div className="nav-item-dot" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="nav-section">
              <div className="nav-section-label">Dashboards</div>
              <div className="nav-section-items">
                {dashboards.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`nav-item ${isActive(href) ? 'active' : ''}`}
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="nav-section">
              <div className="nav-section-label">Pages</div>
              <div className="nav-section-items">
                {pages.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`nav-item ${isActive(href) ? 'active' : ''}`}
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="nav-section">
              {otherSections.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="nav-item nav-item-collapsed"
                >
                  <Icon size={18} strokeWidth={2} />
                  <span>{label}</span>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </Link>
              ))}
            </div>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-footer-logo">
              <div className="footer-logo-icon">❄</div>
              <span className="footer-logo-text">snowUI</span>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-h-screen">
        <HeaderBar />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}
