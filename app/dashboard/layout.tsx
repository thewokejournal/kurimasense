'use client'

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
      <aside className="glass-rail">
        <div className="rail-inner">
          <div className="rail-logo">
            <div className="logo-mark">K</div>
          </div>
          <div className="rail-divider" />
          {navItems.map(({ href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`rail-icon ${pathname === href ? 'active' : ''}`}
            >
              <Icon size={20} strokeWidth={1.75} />
            </Link>
          ))}
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
