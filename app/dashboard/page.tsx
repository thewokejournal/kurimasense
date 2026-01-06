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
import { FieldTimeline } from '@/components/FieldTimeline'
import { ConfidenceBadge } from '@/components/ConfidenceBadge'
import type { TimelineEntry } from '@/lib/timeline'
import { fetchAnalysisRunsByField, fetchAnalysisRunById, fetchContext, generateProvenance, generateDecisionContexts, createAnalysisRun, fetchAllFields, type AnalysisRun, type ContextData, type InferenceProvenance, type DecisionContextResponse, type Field } from '@/app/lib/api'
import { formatGeneratedAt } from '@/app/lib/inferenceAdapter'
import type { InferenceResponse } from '@/app/types/inference'
import ContextPanel from '@/components/ContextPanel'
import ProvenancePanel from '@/components/ProvenancePanel'
import InterpretationAssistant from '@/components/InterpretationAssistant'
import DecisionContextPanel from '@/components/DecisionContextPanel'
import CreateAnalysisDialog from '@/components/CreateAnalysisDialog'
import AnalysisSuccessFeedback from '@/components/AnalysisSuccessFeedback'
import AnalysisRunList from '@/components/AnalysisRunList'
import AnalysisRunDetail from '@/components/AnalysisRunDetail'


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
  // Field selection (hardcoded for now, matching existing UI)
  const selectedFieldId = 'test-field-1'
  
  const [analysisRuns, setAnalysisRuns] = useState<AnalysisRun[]>([])
  const [selectedAnalysisRunId, setSelectedAnalysisRunId] = useState<string | null>(null)
  const [inference, setInference] = useState<InferenceResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Phase 5: Context state (loaded only via explicit user action)
  const [context, setContext] = useState<ContextData | null>(null)
  const [isLoadingContext, setIsLoadingContext] = useState(false)
  const [contextError, setContextError] = useState<string | null>(null)
  const [showContext, setShowContext] = useState(false)
  
  // Phase 6.1: Provenance state (loaded only via explicit user action, view-time only)
  const [provenance, setProvenance] = useState<InferenceProvenance | null>(null)
  const [isLoadingProvenance, setIsLoadingProvenance] = useState(false)
  const [provenanceError, setProvenanceError] = useState<string | null>(null)
  const [showProvenance, setShowProvenance] = useState(false)
  
  // Phase 7: Decision context state (user-invoked only, non-actionable)
  const [decisionContexts, setDecisionContexts] = useState<DecisionContextResponse | null>(null)
  const [isLoadingDecisionContexts, setIsLoadingDecisionContexts] = useState(false)
  const [decisionContextError, setDecisionContextError] = useState<string | null>(null)
  const [showDecisionContexts, setShowDecisionContexts] = useState(false)

  // Phase A: Analysis creation state
  const [fields, setFields] = useState<Field[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreatingAnalysis, setIsCreatingAnalysis] = useState(false)
  const [createAnalysisError, setCreateAnalysisError] = useState<string | null>(null)
  const [createdAnalysisRun, setCreatedAnalysisRun] = useState<AnalysisRun | null>(null)

  // Load fields for analysis creation
  useEffect(() => {
    async function loadFields() {
      try {
        const fieldsData = await fetchAllFields()
        setFields(fieldsData)
      } catch (err) {
        console.error('Failed to load fields:', err)
      }
    }
    loadFields()
  }, [])

  // Load analysis runs for the selected field
  useEffect(() => {
    async function loadAnalysisRuns() {
      try {
        const runs = await fetchAnalysisRunsByField(selectedFieldId)
        setAnalysisRuns(runs)
        
        // Phase A: Do not privilege "first" or "latest" runs
        // User must explicitly select an analysis run
      } catch (err) {
        console.error('Failed to load analysis runs:', err)
        setError(err instanceof Error ? err.message : 'Failed to load analysis runs')
        setIsLoading(false)
      }
    }

    loadAnalysisRuns()
  }, [selectedFieldId])

  // Load selected analysis run's inference response
  useEffect(() => {
    async function loadSelectedAnalysisRun() {
      if (!selectedAnalysisRunId) {
        setInference(null)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const run = await fetchAnalysisRunById(selectedAnalysisRunId)
        setInference(run.inference) // Phase 4.2: use 'inference' field (contract)
        setError(null)
      } catch (err) {
        console.error('Failed to load analysis run:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    loadSelectedAnalysisRun()
  }, [selectedAnalysisRunId])

  // Phase 5: Load context only via explicit user action
  async function handleLoadContext() {
    if (!selectedAnalysisRunId || !inference) {
      return
    }

    // Find the selected analysis run to get time window
    const selectedRun = analysisRuns.find(run => run.id === selectedAnalysisRunId)
    if (!selectedRun) {
      return
    }

    try {
      setIsLoadingContext(true)
      setContextError(null)
      const contextData = await fetchContext(
        selectedFieldId,
        selectedRun.windowStart,
        selectedRun.windowEnd
      )
      setContext(contextData)
      setShowContext(true)
    } catch (err) {
      console.error('Failed to load context:', err)
      setContextError(err instanceof Error ? err.message : 'Failed to load context')
    } finally {
      setIsLoadingContext(false)
    }
  }

  // Phase A: Handle analysis creation
  async function handleCreateAnalysis(fieldId: string, windowStart: string, windowEnd: string) {
    try {
      setIsCreatingAnalysis(true)
      setCreateAnalysisError(null)
      const newRun = await createAnalysisRun(fieldId, windowStart, windowEnd)
      setCreatedAnalysisRun(newRun)
      setIsCreateDialogOpen(false)
      
      // Phase A: Explicit reload behavior - only reload if viewing the same field
      // This is NOT automatic - it's explicit because:
      // 1. Success feedback will show, making it clear what happened
      // 2. Reload only happens if user is viewing the field they just created analysis for
      // 3. If they created for a different field, they'll see success but list won't change (explicit)
      if (fieldId === selectedFieldId) {
        const runs = await fetchAnalysisRunsByField(selectedFieldId)
        setAnalysisRuns(runs)
        // Phase A: Auto-select the newly created analysis for convenience
        // This is explicit because success feedback shows, and user can see the new analysis immediately
        setSelectedAnalysisRunId(newRun.id)
      }
    } catch (err) {
      console.error('Failed to create analysis run:', err)
      setCreateAnalysisError(err instanceof Error ? err.message : 'Failed to create analysis run')
    } finally {
      setIsCreatingAnalysis(false)
    }
  }

  // Phase 6.1: Generate provenance only via explicit user action (view-time only, NOT persisted)
  async function handleShowProvenance() {
    if (!selectedAnalysisRunId || !inference) {
      return
    }

    // Find the selected analysis run to get time window
    const selectedRun = analysisRuns.find(run => run.id === selectedAnalysisRunId)
    if (!selectedRun) {
      return
    }

    try {
      setIsLoadingProvenance(true)
      setProvenanceError(null)
      const provenanceData = await generateProvenance(
        selectedFieldId,
        selectedRun.windowStart,
        selectedRun.windowEnd
      )
      setProvenance(provenanceData)
      setShowProvenance(true)
    } catch (err) {
      console.error('Failed to generate provenance:', err)
      setProvenanceError(err instanceof Error ? err.message : 'Failed to generate provenance')
    } finally {
      setIsLoadingProvenance(false)
    }
  }

  // Map inference to component props (Phase 4.3: use verbatim labels)
  const statusForUI = inference?.status === 'healthy' ? 'Healthy' : 
                      inference?.status === 'watch' ? 'Watch' :
                      inference?.status === 'stressed' ? 'Stressed' : 'Stable'
  
  const trendForUI = inference?.trend === 'improving' ? 'Improving' :
                     inference?.trend === 'declining' ? 'Declining' : 'Stable'
  
  const confidenceForUI = inference?.confidence === 'high' ? 'High' :
                          inference?.confidence === 'medium' ? 'Medium' : 'Low'

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

            {/* Phase B: Field selector remains, analysis run selection moved to dedicated section below */}

            <div className="command-control">
              <Calendar className="w-4 h-4" />
              <span>Last 30 days</span>
              <ChevronDown className="w-3.5 h-3.5 ml-auto opacity-60" />
            </div>

            <div className="command-separator" />

            <div className="flex gap-2">
              {/* Phase A: Explicit analysis creation button */}
              <button
                onClick={() => setIsCreateDialogOpen(true)}
                className="btn-primary"
              >
                Run Analysis
              </button>
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

        {/* ===== PHASE B: ANALYSIS RUNS SECTION ===== */}
        {/* Purpose: Display all AnalysisRuns for the selected field in chronological order */}
        {/* Navigation path: Field → AnalysisRuns → AnalysisRun detail */}
        {analysisRuns.length > 0 && (
          <div className="dashboard-section dashboard-section-analysis-runs mt-6 mb-10">
            <section className="dashboard-section-tight">
              <div className="mb-4">
                <span className="meta-text uppercase tracking-wider" style={{ letterSpacing: '0.08em' }}>Analysis Runs</span>
                <p className="meta-text text-xs mt-1 opacity-70">
                  Historical analysis records for this field. Select a run to inspect its details.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <AnalysisRunList
                  analysisRuns={analysisRuns}
                  selectedAnalysisRunId={selectedAnalysisRunId}
                  onSelectAnalysisRun={setSelectedAnalysisRunId}
                />
              </motion.div>
            </section>
          </div>
        )}

        {/* ===== PHASE B: ANALYSIS RUN DETAIL (REPLAY VIEW) ===== */}
        {/* Purpose: Display stored inference exactly as recorded - read-only replay */}
        {selectedAnalysisRunId && analysisRuns.find(r => r.id === selectedAnalysisRunId) && (
          <div className="dashboard-section dashboard-section-analysis-detail mt-10 mb-16">
            <section className="dashboard-section-tight">
              <div className="mb-4">
                <span className="meta-text uppercase tracking-wider" style={{ letterSpacing: '0.08em' }}>Analysis Detail</span>
                <p className="meta-text text-xs mt-1 opacity-70">
                  Historical record replay. Stored inference displayed exactly as recorded.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <AnalysisRunDetail
                  analysisRun={analysisRuns.find(r => r.id === selectedAnalysisRunId)!}
                  field={fields.find(f => f.id === selectedFieldId)}
                />
              </motion.div>
            </section>
          </div>
        )}

        {/* ===== PRIMARY SUMMARY SECTION (TIER-1 SAFE INSERTION ZONE) ===== */}
        {/* Purpose: Quick overview - shown only when an analysis is selected */}
        {/* Phase B: This is a secondary view - full details are in AnalysisRunDetail */}
        {selectedAnalysisRunId && inference && (
          <div className="dashboard-section dashboard-section-primary-summary mt-10 mb-16">
            <div className="bg-card rounded-xl shadow-sm p-6">
              <CropHealthSummary
                status={statusForUI as any}
                trend={trendForUI as any}
                confidence={confidenceForUI as any}
                detectedAt={formatGeneratedAt(inference.generatedAt)}
                trendDirection={inference.trend}
              />
            </div>
          </div>
        )}

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" style={{ marginTop: '20px', marginBottom: '16px' }}>
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card className="surface p-5">
                    <div className="stat-value tabular-nums">
                      {s.value}
                    </div>
                    <div className="stat-label">
                      {s.label}
                    </div>
                    <div className="stat-delta positive">
                      {s.delta}
                    </div>
                    <div className="confidence-indicator">
                      <span className="confidence-dot" />
                      {s.timeContext}
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="meta-text uppercase tracking-wider" style={{ letterSpacing: '0.08em' }}>Crop Health Map</span>
                <h2 id="health-map-heading" className="section-heading text-lg font-semibold mb-4">Field Overview</h2>
              </div>
              <p className="meta-text">Last updated: 2h ago</p>
            </div>
            <div className="mt-6">
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

        {/* Phase B: Categories and explanation now shown in AnalysisRunDetail component above */}
        {/* This section removed to avoid duplication - all inference details are in the dedicated replay view */}

        {/* ===== CONTEXT SECTION (Phase 5) ===== */}
        {/* Purpose: External, read-only context data. Visually secondary, clearly separated from inference */}
        <div className="dashboard-section dashboard-section-context mt-6 mb-14">
          <section className="dashboard-section-tight">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="meta-text uppercase tracking-wider" style={{ letterSpacing: '0.08em' }}>Context</span>
                <p className="meta-text text-xs mt-1 opacity-70">
                  Additional descriptive information. Does not modify or explain inference.
                </p>
              </div>
              {inference && !showContext && (
                <button
                  onClick={handleLoadContext}
                  disabled={isLoadingContext}
                  className="btn-secondary text-sm"
                >
                  {isLoadingContext ? 'Loading...' : 'Load Context'}
                </button>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {contextError && (
                <Card className="surface-soft p-4 border-l-4 border-red-500">
                  <p className="label-text text-red-600 dark:text-red-400 text-sm">{contextError}</p>
                </Card>
              )}
              {showContext && (
                <ContextPanel context={context} isLoading={isLoadingContext} />
              )}
            </motion.div>
          </section>
        </div>

        {/* ===== PROVENANCE SECTION (Phase 6.1) ===== */}
        {/* Purpose: View-time provenance showing HOW inference was produced. Hidden by default, revealed via explicit user action */}
        <div className="dashboard-section dashboard-section-provenance mt-6 mb-14">
          <section className="dashboard-section-tight">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="meta-text uppercase tracking-wider" style={{ letterSpacing: '0.08em' }}>Technical Details</span>
                <p className="meta-text text-xs mt-1 opacity-70">
                  Inference trace showing mechanical reasoning. Does not explain real-world causes.
                </p>
              </div>
              {inference && !showProvenance && (
                <button
                  onClick={handleShowProvenance}
                  disabled={isLoadingProvenance}
                  className="btn-secondary text-sm"
                >
                  {isLoadingProvenance ? 'Loading...' : 'Show Technical Details'}
                </button>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {provenanceError && (
                <Card className="surface-soft p-4 border-l-4 border-red-500">
                  <p className="label-text text-red-600 dark:text-red-400 text-sm">{provenanceError}</p>
                </Card>
              )}
              {showProvenance && (
                <ProvenancePanel provenance={provenance} isLoading={isLoadingProvenance} />
              )}
            </motion.div>
          </section>
        </div>

                {/* ===== DECISION CONTEXT SECTION (Phase 7) ===== */}
        {/* Purpose: Non-actionable decision contexts to help structure decision-making. Hidden by default, revealed via explicit user action */}
        <div className="dashboard-section dashboard-section-decision-context mt-6 mb-14">
          <section className="dashboard-section-tight">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="meta-text uppercase tracking-wider" style={{ letterSpacing: '0.08em' }}>Decision Context</span>
                <p className="meta-text text-xs mt-1 opacity-70">
                  Non-actionable frames to help structure decision-making. Clarifies considerations and uncertainties only.
                </p>
              </div>
              {inference && !showDecisionContexts && (
                <button
                  onClick={async () => {
                    if (!selectedAnalysisRunId) return
                    try {
                      setIsLoadingDecisionContexts(true)
                      setDecisionContextError(null)
                      const contexts = await generateDecisionContexts(selectedAnalysisRunId)
                      setDecisionContexts(contexts)
                      setShowDecisionContexts(true)
                    } catch (err) {
                      console.error('Failed to generate decision contexts:', err)
                      setDecisionContextError(err instanceof Error ? err.message : 'Failed to generate decision contexts')
                    } finally {
                      setIsLoadingDecisionContexts(false)
                    }
                  }}
                  disabled={isLoadingDecisionContexts}
                  className="btn-secondary text-sm"
                >
                  {isLoadingDecisionContexts ? 'Loading...' : 'Show Decision Contexts'}
                </button>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {decisionContextError && (
                <Card className="surface-soft p-4 border-l-4 border-red-500">
                  <p className="label-text text-red-600 dark:text-red-400 text-sm">{decisionContextError}</p>
                </Card>
              )}
              {showDecisionContexts && (
                <DecisionContextPanel decisionContexts={decisionContexts} isLoading={isLoadingDecisionContexts} />
              )}
            </motion.div>
          </section>
        </div>

        {/* ===== DATA TABLE SECTION ===== */}

      </div>

      {/* Phase A: Analysis creation dialog */}
      <CreateAnalysisDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false)
          setCreateAnalysisError(null)
        }}
        fields={fields}
        onCreate={handleCreateAnalysis}
        isCreating={isCreatingAnalysis}
        error={createAnalysisError}
      />

      {/* Phase A: Analysis success feedback */}
      {createdAnalysisRun && (
        <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-50">
          <AnalysisSuccessFeedback
            analysisRun={createdAnalysisRun}
            onClose={() => setCreatedAnalysisRun(null)}
            fieldName={fields.find(f => f.id === createdAnalysisRun.fieldId)?.name}
            isCurrentField={createdAnalysisRun.fieldId === selectedFieldId}
          />
        </div>
      )}
    </main>
  )
}
