'use client'

import { LayoutDashboard, Star, Search, Sun, Bell, Clock, Grid3x3 } from 'lucide-react'
import { useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

export default function HeaderBar() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="header-bar">
      <div className="header-bar-left">
        <LayoutDashboard size={20} strokeWidth={2} className="header-bar-icon" />
        <Star size={18} strokeWidth={2} className="header-bar-icon" />
        <span className="header-bar-breadcrumb">Dashboards / Default</span>
      </div>
      
      <div className="header-bar-center">
        <div className="header-search">
          <Search size={18} strokeWidth={2} className="header-search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="header-search-input"
          />
        </div>
      </div>

      <div className="header-bar-right">
        <ThemeToggle />
        <button className="header-bar-action" aria-label="Notifications">
          <Bell size={18} strokeWidth={2} />
        </button>
        <button className="header-bar-action" aria-label="History">
          <Clock size={18} strokeWidth={2} />
        </button>
        <button className="header-bar-action" aria-label="Menu">
          <Grid3x3 size={18} strokeWidth={2} />
        </button>
      </div>
    </header>
  )
}

