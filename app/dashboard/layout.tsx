'use client'

/**
 * Dashboard Layout - Clean Rebuild
 * Single header bar with Logo + Nav + Search + Theme Toggle
 * No sidebars - just the header and main content
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-app">
      {children}
    </div>
  )
}
