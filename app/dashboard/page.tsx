'use client'

import { motion } from 'framer-motion'
import { Map, Leaf, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import NdviMapPanel from '@/components/NdviMapPanel'
import FieldsTable from '@/components/FieldsTable'


const stats = [
  { label: 'Fields Monitored', value: '12', icon: Map },
  { label: 'Avg Crop Health', value: '82%', icon: Leaf },
  { label: 'Active Alerts', value: '2', icon: AlertTriangle },
]

export default function DashboardPage() {
  return (
    <main className="dashboard-shell">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-6 space-y-6">

        {/* Header */}
        <header className="dashboard-header">
          <span className="meta-text uppercase tracking-wider">Overview</span>
          <h1 className="page-title">Dashboard</h1>
          <p className="meta-text mt-1">Satellite-powered crop intelligence</p>
        </header>

        {/* Stats Section */}
        <section aria-labelledby="stats-heading" className="">
          <div className="mb-2">
            <span className="meta-text uppercase tracking-wider">Key metrics</span>
          </div>
          <h2 id="stats-heading" className="sr-only">Key metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="stat-card">
                  <div className="flex items-start gap-4">
                    <s.icon className="stat-icon" />
                    <div>
                      <div className="tabular-nums value-text leading-tight">{s.value}</div>
                      <div className="meta-text mt-1 uppercase tracking-wider">{s.label}</div>
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
            <div>
              <span className="meta-text uppercase tracking-wider">Maps</span>
              <h2 id="ndvi-heading" className="label-text font-medium">NDVI Map</h2>
            </div>
            <p className="meta-text">Overview & metrics</p>
          </div>
          <NdviMapPanel />
        </section>

        {/* Insight */}
        <section>
          <div className="mb-2">
            <span className="meta-text uppercase tracking-wider">Insights</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="insight-card mt-2">
              <h3 className="label-text font-semibold mb-1">Latest Insight</h3>
              <p className="label-text">NDVI decline detected in Field 3 during flowering stage. Potential moisture stress observed.</p>
            </Card>
          </motion.div>
        </section>

        {/* Fields Table */}
        <section aria-labelledby="fields-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="fields-heading" className="label-text font-medium">My Fields</h2>
            <p className="meta-text">Recent updates</p>
          </div>
          <FieldsTable />
        </section>

      </div>
    </main>
  )
}
