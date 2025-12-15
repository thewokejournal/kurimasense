'use client'

import { motion } from 'framer-motion'
import { Map, Leaf, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import NdviMapPanel from '@/components/NdviMapPanel'


const stats = [
  { label: 'Fields Monitored', value: '12', icon: Map },
  { label: 'Avg Crop Health', value: '82%', icon: Leaf },
  { label: 'Active Alerts', value: '2', icon: AlertTriangle },
]

export default function DashboardPage() {
  return (
    <main className="dashboard-shell">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8 space-y-8">

        {/* Header */}
        <header className="dashboard-header">
          <h1 className="text-2xl md:text-3xl font-semibold">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Satellite-powered crop intelligence</p>
        </header>

        {/* Stats Section */}
        <section aria-labelledby="stats-heading" className="">
          <h2 id="stats-heading" className="sr-only">Key metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="stat-card p-4">
                  <div className="flex items-start gap-4">
                    <s.icon className="stat-icon" />
                    <div>
                      <div className="text-xl md:text-2xl font-semibold text-slate-100">{s.value}</div>
                      <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{s.label}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* NDVI Section */}
        <section aria-labelledby="ndvi-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="ndvi-heading" className="text-lg font-medium">NDVI Map</h2>
            <p className="text-sm text-slate-400">Overview & metrics</p>
          </div>
          <NdviMapPanel />
        </section>

        {/* Insight */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="insight-card mt-2 p-4">
              <h3 className="text-sm font-semibold mb-1">Latest Insight</h3>
              <p className="text-sm text-slate-200">NDVI decline detected in Field 3 during flowering stage. Potential moisture stress observed.</p>
            </Card>
          </motion.div>
        </section>

      </div>
    </main>
  )
}
