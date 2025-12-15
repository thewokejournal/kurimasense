'use client'

/**
 * CROP HEALTH REPORTING CONTRACT
 * 
 * This dashboard follows the Crop Health Reporting Contract:
 * - Crop health is the primary output of all systems
 * - All UI components must support health reporting and decision-making
 * - Backend responses must conform to this contract (health-first data structure)
 * 
 * Internal documentation for developers only - not visible in UI
 */

import { Home, Map, Layers, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', icon: Home },
  { href: '/fields', icon: Map },
  { href: '/analytics', icon: Layers },
  { href: '/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* ---------- Sidebar Rail ---------- */}
      <aside className="glass-rail">
        <div className="rail-inner">

          {/* Logo Lockup */}
          <div className="rail-logo">
            <div className="logo-mark">K</div>
          </div>

          <div className="rail-divider" />

          {/* Nav Icons */}
          {navItems.map(({ href, icon: Icon }) => {
            const active = pathname === href

            return (
              <Link
                key={href}
                href={href}
                className={`rail-icon ${active ? 'active' : ''}`}
              >
                <Icon size={20} strokeWidth={1.75} />
              </Link>
            )
          })}
        </div>
      </aside>

      {/* ---------- Content ---------- */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
