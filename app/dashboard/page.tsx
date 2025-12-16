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

import { motion } from 'framer-motion'
import { Map, Leaf, AlertTriangle, ChevronDown, Calendar, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import CropHealthSummary from '@/components/dashboard/CropHealthSummary'
import NdviMapPanel from '@/components/NdviMapPanel'
import FieldsTable from '@/components/FieldsTable'


const stats = [
  { label: 'Active Parcels', value: '12', delta: '+1 vs last scan', timeContext: 'Last 24 hours', icon: Map },
  { label: 'Canopy Vigor Index', value: '82%', delta: '+2.4% from previous period', timeContext: 'Last 7 days', icon: Leaf },
  { label: 'Field Advisories', value: '2', delta: '−1 resolved', timeContext: 'Last 48 hours', icon: AlertTriangle },
]

export default function DashboardPage() {
  return (
    <main className="dashboard-shell">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8">

        {/* Header */}
        <header className="dashboard-header dashboard-section-tight">
          <span className="meta-text uppercase tracking-wider">Crop Health Report</span>
          <h1 className="page-title">Field Dashboard</h1>
          <p className="meta-text mt-1">Satellite monitoring for your crops</p>
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
              Crop Vigor
            </button>
            <button className="command-control" style={{ minWidth: 'auto', paddingLeft: '12px', paddingRight: '12px' }}>
              Rainfall
            </button>
            <button className="command-control" style={{ minWidth: 'auto', paddingLeft: '12px', paddingRight: '12px' }}>
              Water Stress
            </button>
          </div>
        </motion.div>

        {/* Tier-1: Crop Health Summary - Primary focus */}
        <div className="w-full mb-16">
          <CropHealthSummary
            status="Healthy"
            score={82}
            trend="up"
            trendLabel="Improving over last 14 days"
          />
        </div>

        {/* Tier-2: Supporting Metrics - Reduced prominence */}
        <section aria-labelledby="stats-heading" className="mb-12">
          <div className="mb-4">
            <span className="text-xs uppercase tracking-wider text-gray-500">Supporting Metrics</span>
          </div>
          <h2 id="stats-heading" className="sr-only">Supporting Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="stat-card opacity-90">
                  <div className="stat-value tabular-nums">{s.value}</div>
                  <div>
                    <div className="stat-delta positive">{s.delta}</div>
                    <div className="stat-label">{s.label}</div>
                    <div className="confidence-indicator" style={{ opacity: 0.45, fontSize: '9px' }}>
                      <span className="confidence-dot" />
                      <span>{s.timeContext}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Health Map Section */}
        <section aria-labelledby="health-map-heading" className="dashboard-section">
          <div className="flex items-center justify-between">
            <div>
              <span className="meta-text uppercase tracking-wider">Crop Health Map</span>
              <h2 id="health-map-heading" className="section-heading">Field Overview</h2>
            </div>
            <p className="meta-text">Last updated: 2h ago</p>
          </div>
          <div className="mt-3">
            <NdviMapPanel />
          </div>
        </section>

        {/* Insight */}
        <section className="dashboard-section-tight">
          <div className="mb-2">
            <span className="meta-text uppercase tracking-wider">Field Observations</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="insight-card mt-2">
              <h3 className="font-bold tracking-tight mb-2">Recent Observation</h3>
              <p className="label-text">Crop vigor declining in Parcel 3 during reproductive stage. Dry conditions observed in southeast area since mid-April.</p>
              <div className="confidence-indicator" style={{ marginTop: '10px', fontSize: '9px', opacity: 0.45 }}>
                <span className="confidence-dot" />
                <span>Reported Apr 21, 2025 at 14:32 UTC</span>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Fields Table */}
        <section aria-labelledby="fields-heading" className="dashboard-section">
          <div className="flex items-center justify-between">
            <h2 id="fields-heading" className="section-heading">Your Fields</h2>
            <p className="meta-text">Last checked</p>
          </div>
          <div className="mt-3">
            <FieldsTable />
          </div>
        </section>

      </div>
    </main>
  )
}
