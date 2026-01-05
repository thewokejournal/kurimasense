'use client'

import { Search, ChevronRight, Menu } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'

const getBreadcrumbs = (pathname: string) => {
  if (pathname?.startsWith('/dashboard')) {
    return ['Dashboard']
  }
  if (pathname === '/fields') {
    return ['Fields']
  }
  return ['Dashboard']
}

export default function HeaderBar({ onMobileMenuToggle }: { onMobileMenuToggle: () => void }) {
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const breadcrumbs = getBreadcrumbs(pathname || '')

  return (
    <header className="dashboard-header-bar">
      <button 
        className="mobile-menu-button"
        onClick={onMobileMenuToggle}
        aria-label="Toggle navigation menu"
      >
        <Menu size={20} strokeWidth={2} />
      </button>

      <div className="header-breadcrumbs">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="breadcrumb-item">
            {index > 0 && <ChevronRight size={16} className="breadcrumb-separator" />}
            <span className={index === breadcrumbs.length - 1 ? 'breadcrumb-current' : ''}>
              {crumb}
            </span>
          </div>
        ))}
      </div>

      <div className="header-search-wrapper">
        <Search size={18} strokeWidth={2} className="header-search-icon" />
        <input
          type="text"
          placeholder="Search fields..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="header-search-input"
        />
      </div>
      
      <div className="header-actions">
        <ThemeToggle />
      </div>
    </header>
  )
}
