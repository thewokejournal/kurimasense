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
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Satellite-powered crop intelligence</p>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="stat-card">
              <s.icon className="stat-icon" />
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>
      <NdviMapPanel />


      {/* Insight */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="insight-card">
          <h2>Latest Insight</h2>
          <p>
            NDVI decline detected in Field 3 during flowering stage.
            Potential moisture stress observed.
          </p>
        </Card>
      </motion.div>
    </main>
  )
}
