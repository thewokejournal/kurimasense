'use client'

import { LayoutDashboard, Map } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (href: string) => pathname === href || (href === '/dashboard' && pathname?.startsWith('/dashboard'))

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="dashboard-layout">
      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">KurimaSense</div>
          </div>
        
        <nav className="sidebar-nav">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${isActive(href) ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      
      <div className="dashboard-main-wrapper">
        <HeaderBar onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="dashboard-main">
        {children}
      </main>
      </div>
    </div>
  )
}
