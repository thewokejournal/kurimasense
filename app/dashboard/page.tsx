'use client'

import { motion } from 'framer-motion'
import { Map, Leaf, AlertTriangle, ChevronDown, Calendar } from 'lucide-react'
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
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8">

        {/* Header */}
        <header className="dashboard-header dashboard-section-tight">
          <span className="meta-text uppercase tracking-wider">Overview</span>
          <h1 className="page-title">Dashboard</h1>
          <p className="meta-text mt-1">Satellite-powered crop intelligence</p>
        </header>

        {/* Command Bar */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="command-bar"
        >
          <div className="command-control command-control-active">
            <Map className="w-4 h-4" />
            <span>Field 3 - Corn</span>
            <ChevronDown className="w-3.5 h-3.5 ml-auto opacity-60" />
          </div>

          <div className="command-control">
            <Calendar className="w-4 h-4" />
            <span>Last 30 days</span>
            <ChevronDown className="w-3.5 h-3.5 ml-auto opacity-60" />
          </div>

          <div className="command-separator" />

          <div className="flex gap-2">
            <button className="command-control command-control-active" style={{ minWidth: 'auto', paddingLeft: '12px', paddingRight: '12px' }}>
              NDVI
            </button>
            <button className="command-control" style={{ minWidth: 'auto', paddingLeft: '12px', paddingRight: '12px' }}>
              Rainfall
            </button>
            <button className="command-control" style={{ minWidth: 'auto', paddingLeft: '12px', paddingRight: '12px' }}>
              Stress
            </button>
          </div>
        </motion.div>

        {/* Stats Section */}
        <section aria-labelledby="stats-heading" className="dashboard-section">
          <div className="mb-2">
            <span className="meta-text uppercase tracking-wider">Key metrics</span>
          </div>
          <h2 id="stats-heading" className="sr-only">Key metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
        <section aria-labelledby="ndvi-heading" className="dashboard-section">
          <div className="flex items-center justify-between">
            <div>
              <span className="meta-text uppercase tracking-wider">Maps</span>
              <h2 id="ndvi-heading" className="section-heading">NDVI Map</h2>
            </div>
            <p className="meta-text">Overview & metrics</p>
          </div>
          <div className="mt-3">
            <NdviMapPanel />
          </div>
        </section>

        {/* Insight */}
        <section className="dashboard-section-tight">
          <div className="mb-2">
            <span className="meta-text uppercase tracking-wider">Insights</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="insight-card mt-2">
              <h3 className="font-bold tracking-tight mb-2">Latest Insight</h3>
              <p className="label-text">NDVI decline detected in Field 3 during flowering stage. Potential moisture stress observed.</p>
            </Card>
          </motion.div>
        </section>

        {/* Fields Table */}
        <section aria-labelledby="fields-heading" className="dashboard-section">
          <div className="flex items-center justify-between">
            <h2 id="fields-heading" className="section-heading">My Fields</h2>
            <p className="meta-text">Recent updates</p>
          </div>
          <div className="mt-3">
            <FieldsTable />
          </div>
        </section>

      </div>
    </main>
  )
}
