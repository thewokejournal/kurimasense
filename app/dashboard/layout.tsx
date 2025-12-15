'use client'

import { Search, Bell, User } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-100 via-white to-sky-200">
      <aside className="w-16 bg-emerald-600 flex flex-col items-center py-4 gap-6">
        <div className="h-8 w-8 rounded-lg bg-white" />
        <div className="h-6 w-6 rounded-md bg-white/70" />
        <div className="h-6 w-6 rounded-md bg-white/70" />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center justify-between px-6 bg-white/60 backdrop-blur border-b border-slate-200">
          <div className="flex items-center gap-3 text-slate-400">
            <Search className="h-4 w-4" />
            <span className="text-sm">Search</span>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="h-4 w-4 text-slate-500" />
            <User className="h-5 w-5 text-slate-600" />
          </div>
        </header>

        <main className="flex-1 px-8 py-6">{children}</main>
      </div>
    </div>
  )
}
