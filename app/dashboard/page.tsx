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
import CropHealthSummary from '@/components/CropHealthSummary'
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

        {/* ===== HEADER SECTION ===== */}
        {/* Purpose: Dashboard title, subtitle, and contextual labels */}
        {/* Safe to add: Breadcrumbs, filters, user context */}
        <div className="dashboard-section dashboard-section-header mb-12">
          <div className="max-w-3xl">
            <header className="dashboard-header dashboard-section-tight">
              <span className="meta-text uppercase tracking-wider" style={{ letterSpacing: '0.08em' }}>Crop Health Report</span>
              <h1 className="page-title mb-6" style={{ lineHeight: '1.1', letterSpacing: '-0.04em' }}>Field Dashboard</h1>
              <p className="meta-text mt-1">Satellite monitoring for your crops</p>
            </header>
          </div>
        </div>

        {/* ===== COMMAND BAR SECTION ===== */}
        {/* Purpose: Primary controls for field selection, date range, and data layer toggles */}
        {/* Safe to add: Additional filter buttons, export actions, view toggles */}
        <div className="dashboard-section dashboard-section-controls mb-10">
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
        </div>

        {/* ===== PRIMARY SUMMARY SECTION (TIER-1 SAFE INSERTION ZONE) ===== */}
        {/* Purpose: Dominant crop health summary - the single most important metric */}
        {/* Safe to add: Supplementary callout cards, quick action buttons */}
        {/* WARNING: This section must remain visually dominant - do not add competing elements */}
        <div className="dashboard-section dashboard-section-primary-summary mb-16">
          <div className="bg-muted/30 rounded-xl shadow-sm p-8 border border-border/50">
            <CropHealthSummary
              status="Stable"
              trend="Improving"
              confidence="High"
              detectedAt="April 18, 2025 (4 days ago)"
            />
          </div>
        </div>

        {/* ===== SUPPORTING METRICS SECTION ===== */}
        {/* Purpose: Secondary KPIs that support crop health narrative */}
        {/* Safe to add: Additional stat cards (max 3-4 per row), comparison indicators */}
        {/* Grid system: 1 col mobile, 3 cols desktop - maintain responsive structure */}
        <div className="dashboard-section dashboard-section-metrics mb-14">
          <section aria-labelledby="stats-heading" className="dashboard-section">
            <div className="mb-2">
              <span className="meta-text uppercase tracking-wider" style={{ opacity: 0.5, fontSize: '10px' }}>Supporting Metrics</span>
            </div>
            <h2 id="stats-heading" className="sr-only">Supporting Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginTop: '20px', marginBottom: '16px' }}>
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card className="stat-card">
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
        </div>

        {/* ===== MAP VISUALIZATION SECTION ===== */}
        {/* Purpose: Spatial view of crop health via NDVI map */}
        {/* Safe to add: Map controls, layer toggles, legend, zoom controls */}
        {/* Maintain fixed aspect ratio for map container */}
        <div className="dashboard-section dashboard-section-map mb-14">
          <section aria-labelledby="health-map-heading" className="dashboard-section">
            <div className="flex items-center justify-between">
              <div>
                <span className="meta-text uppercase tracking-wider" style={{ letterSpacing: '0.08em' }}>Crop Health Map</span>
                <h2 id="health-map-heading" className="section-heading text-lg font-semibold">Field Overview</h2>
              </div>
              <p className="meta-text">Last updated: 2h ago</p>
            </div>
            <div className="mt-3">
              <NdviMapPanel />
            </div>
          </section>
        </div>

        {/* ===== INSIGHTS & OBSERVATIONS SECTION ===== */}
        {/* Purpose: Contextual narrative and expert observations */}
        {/* Safe to add: Multiple insight cards, recommendations, alerts */}
        {/* Keep prose-style formatting for readability */}
        <div className="dashboard-section dashboard-section-insights mb-14">
          <section className="dashboard-section-tight">
            <div className="mb-2">
              <span className="meta-text uppercase tracking-wider" style={{ letterSpacing: '0.08em' }}>Field Observations</span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="insight-card mt-2">
                <h3 className="font-semibold tracking-tight mb-2 text-base">Recent Observation</h3>
                <p className="label-text">Crop vigor declining in Parcel 3 during reproductive stage. Dry conditions observed in southeast area since mid-April.</p>
                <div className="confidence-indicator" style={{ marginTop: '10px', fontSize: '9px', opacity: 0.45 }}>
                  <span className="confidence-dot" />
                  <span>Reported Apr 21, 2025 at 14:32 UTC</span>
                </div>
              </Card>
            </motion.div>
          </section>
        </div>

        {/* ===== DATA TABLE SECTION ===== */}
        {/* Purpose: Detailed field-by-field tabular data */}
        {/* Safe to add: Table filters, pagination, export button, column toggles */}
        {/* Maintain table responsiveness for mobile */}
        <div className="dashboard-section dashboard-section-table mb-14">
          <section aria-labelledby="fields-heading" className="dashboard-section">
            <div className="flex items-center justify-between">
              <h2 id="fields-heading" className="section-heading text-lg font-semibold" style={{ letterSpacing: '0.01em' }}>Your Fields</h2>
              <p className="meta-text">Last checked</p>
            </div>
            <div className="mt-3">
              <FieldsTable />
            </div>
          </section>
        </div>

      </div>
    </main>
  )
}
