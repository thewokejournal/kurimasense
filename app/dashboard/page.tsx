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

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Map, Leaf, AlertTriangle, ChevronDown, Calendar, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import CropHealthSummary from '@/components/CropHealthSummary'
import NdviMapPanel from '@/components/NdviMapPanel'
import FieldsTable from '@/components/FieldsTable'
import DashboardCommandBar from '@/components/DashboardCommandBar'
import { FieldTimeline } from '@/components/FieldTimeline'
import { ConfidenceBadge } from '@/components/ConfidenceBadge'
import type { TimelineEntry } from '@/lib/timeline'
import { fetchInference } from '@/app/lib/api'
import { formatGeneratedAt, getPrimaryCategoryMessage } from '@/app/lib/inferenceAdapter'
import type { InferenceResponse } from '@/app/types/inference'


const stats = [
  { label: 'Active Parcels', value: '12', delta: '+1 vs last scan', timeContext: 'Last 24 hours', icon: Map },
  { label: 'Canopy Vigor Index', value: '82%', delta: '+2.4% from previous period', timeContext: 'Last 7 days', icon: Leaf },
  { label: 'Field Advisories', value: '2', delta: '−1 resolved', timeContext: 'Last 48 hours', icon: AlertTriangle },
]

// Mock timeline data for demonstration
const mockTimelineEntries: TimelineEntry[] = [
  {
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    insightId: 'insight-1',
    insightType: 'NDVI approaching upper limit',
    severity: 'medium',
    confidence: 'high',
  },
  {
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    insightId: 'insight-2',
    insightType: 'Temperature elevated',
    severity: 'high',
    confidence: 'medium',
  },
  {
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    insightId: 'insight-3',
    insightType: 'Soil moisture optimal',
    severity: 'low',
    confidence: 'high',
  },
  {
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    insightId: 'insight-4',
    insightType: 'All signals within normal range',
    severity: 'info',
    confidence: 'high',
  },
]

export default function DashboardPage() {
  const [inference, setInference] = useState<InferenceResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadInference() {
      try {
        setIsLoading(true)
        const windowEnd = new Date().toISOString()
        const windowStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        
        const data = await fetchInference({
          fieldId: 'test-field-1',
          windowStart,
          windowEnd,
        })
        
        setInference(data)
        setError(null)
      } catch (err) {
        console.error('Failed to load inference:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    loadInference()
  }, [])

  // Map inference to component props
  const statusForUI = inference?.status === 'healthy' ? 'Healthy' : 
                      inference?.status === 'watch' ? 'Under Observation' :
                      inference?.status === 'stressed' ? 'Stressed' : 'Stable'
  
  const trendForUI = inference?.trend === 'improving' ? 'Improving' :
                     inference?.trend === 'declining' ? 'Declining' : 'Stable'
  
  const confidenceForUI = inference?.confidence === 'high' ? 'High' :
                          inference?.confidence === 'medium' ? 'Medium' : 'Low'

  return (
    <main className="dashboard-shell">
      <DashboardCommandBar />
      
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
              <button className="btn-secondary font-semibold">
                Crop Vigor
              </button>
              <button className="btn-secondary">
                Rainfall
              </button>
              <button className="btn-secondary">
                Water Stress
              </button>
            </div>
          </motion.div>
        </div>

        {/* ===== PRIMARY SUMMARY SECTION (TIER-1 SAFE INSERTION ZONE) ===== */}
        {/* Purpose: Dominant crop health summary - the single most important metric */}
        {/* Safe to add: Supplementary callout cards, quick action buttons */}
        {/* WARNING: This section must remain visually dominant - do not add competing elements */}
        <div className="dashboard-section dashboard-section-primary-summary mt-10 mb-16">
          <div className="bg-card rounded-xl shadow-sm p-6">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading crop health data...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">
                <p>Failed to load data</p>
                <p className="text-sm mt-2">{error}</p>
              </div>
            ) : inference ? (
              <CropHealthSummary
                status={statusForUI as any}
                trend={trendForUI as any}
                confidence={confidenceForUI as any}
                detectedAt={formatGeneratedAt(inference.generatedAt)}
                trendDirection={inference.trend}
                stability={inference.confidence === 'high' ? 0.9 : inference.confidence === 'medium' ? 0.6 : 0.3}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">No data available</div>
            )}
          </div>
        </div>

        {/* ===== SUPPORTING METRICS SECTION ===== */}
        {/* Purpose: Secondary KPIs that support crop health narrative */}
        {/* Safe to add: Additional stat cards (max 3-4 per row), comparison indicators */}
        {/* Grid system: 1 col mobile, 3 cols desktop - maintain responsive structure */}
        <div className="dashboard-section dashboard-section-metrics mt-6 mb-14">
          <section aria-labelledby="stats-heading" className="dashboard-section mt-10">
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
                  <Card className="surface p-5">
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
        <div className="dashboard-section dashboard-section-map mt-10 mb-14">
          <section aria-labelledby="health-map-heading" className="dashboard-section mt-10">
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

        {/* ===== FIELD TIMELINE SECTION ===== */}
        {/* Purpose: Chronological view of field insights and events */}
        {/* Safe to add: Timeline filters, export button, date range selector */}
        <div className="dashboard-section dashboard-section-timeline mt-10 mb-14">
          <section aria-labelledby="timeline-heading" className="dashboard-section-tight">
            <div className="mb-2">
              <span className="meta-text uppercase tracking-wider" style={{ letterSpacing: '0.08em' }}>Field Activity</span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="insight-card mt-2">
                <h3 className="font-semibold tracking-tight mb-3 text-base">Recent Events</h3>
                <FieldTimeline entries={mockTimelineEntries} />
              </div>
            </motion.div>
          </section>
        </div>

        {/* ===== INSIGHTS & OBSERVATIONS SECTION ===== */}
        {/* Purpose: Contextual narrative and expert observations */}
        {/* Safe to add: Multiple insight cards, recommendations, alerts */}
        {/* Keep prose-style formatting for readability */}
        <div className="dashboard-section dashboard-section-insights mt-6 mb-14">
          <section className="dashboard-section-tight">
            <div className="mb-2">
              <span className="meta-text uppercase tracking-wider" style={{ letterSpacing: '0.08em' }}>Field Observations</span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {inference && (
                <Card className="surface-soft p-5 mt-2">
                  <h3 className="font-semibold tracking-tight mb-2 text-base inline-flex items-center gap-2">
                    {inference.categories[0]?.category === 'alert' ? 'Alert' :
                     inference.categories[0]?.category === 'advisory' ? 'Advisory' :
                     inference.categories[0]?.category === 'forecast' ? 'Forecast' : 'Recent Observation'}
                    <ConfidenceBadge 
                      confidence={inference.confidence === 'high' ? 0.9 : inference.confidence === 'medium' ? 0.6 : 0.3} 
                      source="satellite" 
                    />
                  </h3>
                  <p className="label-text">{getPrimaryCategoryMessage(inference)}</p>
                  <div className="confidence-indicator" style={{ marginTop: '10px', fontSize: '9px', opacity: 0.45 }}>
                    <span className="confidence-dot" />
                    <span>Generated {formatGeneratedAt(inference.generatedAt)}</span>
                  </div>
                </Card>
              )}
            </motion.div>
          </section>
        </div>

        {/* ===== DATA TABLE SECTION ===== */}
        {/* Purpose: Detailed field-by-field tabular data */}
        {/* Safe to add: Table filters, pagination, export button, column toggles */}
        {/* Maintain table responsiveness for mobile */}
        <div className="dashboard-section dashboard-section-table mt-10 mb-14">
          <section aria-labelledby="fields-heading" className="dashboard-section mt-10">
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
