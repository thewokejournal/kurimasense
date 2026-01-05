'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

export default function HeaderBar() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="dashboard-header-bar">
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
