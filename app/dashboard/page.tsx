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
import { Map, Leaf, AlertTriangle, ChevronDown, Calendar, Clock, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import NdviMapPanel, { AffectedAreaReportPanel } from '@/components/NdviMapPanel'
import FieldsTable from '@/components/FieldsTable'
import { fetchAnalysisRunsByField, fetchAnalysisRunById, fetchContext, createAnalysisRun, fetchAllFields, type AnalysisRun, type ContextData, type Field } from '@/app/lib/api'
import { formatGeneratedAt } from '@/app/lib/inferenceAdapter'
import type { InferenceResponse } from '@/app/types/inference'
import ContextPanel from '@/components/ContextPanel'
import ProvenancePanel from '@/components/ProvenancePanel'
import InterpretationAssistant from '@/components/InterpretationAssistant'
import AnalysisSuccessFeedback from '@/components/AnalysisSuccessFeedback'
import AnalysisRunList from '@/components/AnalysisRunList'
import AnalysisRunDetail from '@/components/AnalysisRunDetail'
import Logo from '@/components/Logo'
import { LeftSidebar } from '@/components/dashboard/LeftSidebar'
import ThemeToggle from '@/components/ThemeToggle'


const stats = [
  { label: 'Active Parcels', value: '12', delta: '+1 vs last scan', timeContext: 'Last 24 hours', icon: Map },
  { label: 'Canopy Vigor Index', value: '82%', delta: '+2.4% from previous period', timeContext: 'Last 7 days', icon: Leaf },
  { label: 'Field Advisories', value: '2', delta: '−1 resolved', timeContext: 'Last 48 hours', icon: AlertTriangle },
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
  
  // Phase C: Provenance state (loaded only via explicit user action, view-time only)
  // ProvenancePanel now handles loading internally, so we just track visibility
  const [showProvenance, setShowProvenance] = useState(false)
  
  // Phase 7: Decision context state (user-invoked only, non-actionable)
  const [decisionContexts, setDecisionContexts] = useState<DecisionContextResponse | null>(null)
  const [isLoadingDecisionContexts, setIsLoadingDecisionContexts] = useState(false)
  const [decisionContextError, setDecisionContextError] = useState<string | null>(null)

  // Prevent body scroll when dashboard is mounted
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, [])
  const [showDecisionContexts, setShowDecisionContexts] = useState(false)

  // Phase A: Analysis creation state (inline form)
  const [fields, setFields] = useState<Field[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createFieldId, setCreateFieldId] = useState<string>('')
  const [createWindowStart, setCreateWindowStart] = useState<string>('')
  const [createWindowEnd, setCreateWindowEnd] = useState<string>('')
  const [isCreatingAnalysis, setIsCreatingAnalysis] = useState(false)
  const [createAnalysisError, setCreateAnalysisError] = useState<string | null>(null)
  const [createValidationError, setCreateValidationError] = useState<string | null>(null)
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

  // Phase D: Convert datetime-local format to ISO 8601
  // datetime-local produces: 2024-01-01T00:00
  // Backend expects: 2024-01-01T00:00:00Z
  function toISO8601(datetimeLocal: string): string {
    if (!datetimeLocal) return ''
    // If already has seconds, just add Z
    if (datetimeLocal.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
      return datetimeLocal.endsWith('Z') ? datetimeLocal : `${datetimeLocal}Z`
    }
    // Otherwise add :00 for seconds and Z for timezone
    return `${datetimeLocal}:00Z`
  }

  // Phase A: Validate time window
  function validateTimeWindow(start: string, end: string): string | null {
    if (!start || !end) {
      return null // Let required attribute handle empty fields
    }
    const startDate = new Date(start)
    const endDate = new Date(end)
    if (startDate >= endDate) {
      return 'Window start must be before window end'
    }
    return null
  }

  // Phase A: Handle inline form submission
  async function handleSubmitInlineAnalysis(e: React.FormEvent) {
    e.preventDefault()
    
    if (!createFieldId || !createWindowStart || !createWindowEnd) {
      return
    }
    
    // Validate time window
    const timeError = validateTimeWindow(createWindowStart, createWindowEnd)
    if (timeError) {
      setCreateValidationError(timeError)
      return
    }
    
    try {
      setIsCreatingAnalysis(true)
      setCreateAnalysisError(null)
      setCreateValidationError(null)
      
      // Convert to ISO 8601 format
      const windowStartISO = toISO8601(createWindowStart)
      const windowEndISO = toISO8601(createWindowEnd)
      
      const newRun = await createAnalysisRun(createFieldId, windowStartISO, windowEndISO)
      setCreatedAnalysisRun(newRun)
      
      // Reset form and close
      setCreateFieldId('')
      setCreateWindowStart('')
      setCreateWindowEnd('')
      setShowCreateForm(false)
      
      // Phase A: Explicit reload behavior - only reload if viewing the same field
      if (createFieldId === selectedFieldId) {
        const runs = await fetchAnalysisRunsByField(selectedFieldId)
        setAnalysisRuns(runs)
      }
    } catch (err) {
      console.error('Failed to create analysis run:', err)
      setCreateAnalysisError(err instanceof Error ? err.message : 'Failed to create analysis run')
    } finally {
      setIsCreatingAnalysis(false)
    }
  }

  // Phase A: Handle form cancellation
  function handleCancelCreateForm() {
    setShowCreateForm(false)
    setCreateFieldId('')
    setCreateWindowStart('')
    setCreateWindowEnd('')
    setCreateValidationError(null)
    setCreateAnalysisError(null)
  }

  // Phase C: Show provenance panel (ProvenancePanel handles loading internally)
  function handleShowProvenance() {
    setShowProvenance(true)
  }


  return (
    <main className="dashboard-shell">
      {/* Modern Header Bar */}
      <header className="dashboard-header-bar">
        <div className="dashboard-header-left">
          <Logo />
          <nav className="dashboard-header-nav">
            <button className="nav-tab active">Dashboard</button>
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={`nav-tab ${showCreateForm ? 'active' : ''}`}
            >
              Run Analysis
            </button>
          </nav>
        </div>
        <div className="dashboard-header-right">
          <div className="header-search">
            <Search className="header-search-icon w-4 h-4" />
            <input type="text" placeholder="Search fields, analysis runs..." />
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Three-Column Immersive Layout */}
      <div className="dashboard-three-column">
        
        {/* LEFT SIDEBAR - Fields & Global Metrics */}
        <aside className="dashboard-left-sidebar p-6 bg-surface-soft overflow-y-auto">
        <LeftSidebar
          selectedFieldId={selectedFieldId}
          fields={fields}
          onFieldSelect={() => {/* TODO: implement field selection */}}
        />

        </aside>

        {/* CENTER AREA - The Immersive Map */}
        <section className="dashboard-main-area">
          <NdviMapPanel />

          {/* Analysis Creation Form Overlay */}
          {showCreateForm && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="dashboard-card dashboard-form-card shadow-2xl bg-surface-elevated/95 backdrop-blur-md"
              >
                <div className="dashboard-card-header">
                  <div>
                    <h3 className="dashboard-card-title">Create New Analysis Run</h3>
                    <p className="dashboard-card-description">
                      Select a field and time window for analysis.
                    </p>
                  </div>
                </div>
                <form onSubmit={handleSubmitInlineAnalysis} className="dashboard-form">
                  <div className="dashboard-form-grid">
                  {/* Field Selection */}
                    <div className="dashboard-form-field">
                      <label className="dashboard-form-label">Field</label>
                    <select
                      value={createFieldId}
                        onChange={(e) => setCreateFieldId(e.target.value)}
                        className="dashboard-form-input"
                      required
                      disabled={isCreatingAnalysis}
                    >
                      <option value="">Select a field...</option>
                      {fields.map(field => (
                          <option key={field.id} value={field.id}>{field.name}</option>
                      ))}
                    </select>
                  </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="dashboard-form-field">
                        <label className="dashboard-form-label">Start</label>
                      <input
                        type="datetime-local"
                        value={createWindowStart}
                          onChange={(e) => setCreateWindowStart(e.target.value)}
                          className="dashboard-form-input px-4"
                        required
                      />
                    </div>
                      <div className="dashboard-form-field">
                        <label className="dashboard-form-label">End</label>
                      <input
                        type="datetime-local"
                        value={createWindowEnd}
                          onChange={(e) => setCreateWindowEnd(e.target.value)}
                          className="dashboard-form-input px-4"
                        required
                      />
                    </div>
                  </div>

                    <div className="dashboard-form-actions">
                      <button type="submit" className="btn-primary flex-1">Create Analysis</button>
                      <button type="button" onClick={handleCancelCreateForm} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              </form>
            </motion.div>
            </div>
          )}
        </section>

        {/* RIGHT SIDEBAR - Analysis Details & Reports */}
        <aside className="dashboard-right-sidebar">
          {/* Affected Area Metrics Section */}
          <div className="dashboard-card" style={{ padding: 0 }}>
            <AffectedAreaReportPanel />
          </div>

          {/* Analysis History Section - show when no run selected */}
          {!selectedAnalysisRunId && analysisRuns.length > 0 && (
            <div className="space-y-4">
              <div className="metric-section-header">
                Field Reports
              </div>
              <AnalysisRunList
                analysisRuns={analysisRuns}
                selectedAnalysisRunId={selectedAnalysisRunId}
                onSelectAnalysisRun={setSelectedAnalysisRunId}
              />
            </div>
          )}

          {/* Selected Analysis Details */}
            {selectedAnalysisRunId && analysisRuns.find(r => r.id === selectedAnalysisRunId) && (
            <div className="space-y-4">
              <div className="metric-section-header flex items-center justify-between">
                <span>Record Details</span>
                <button 
                  onClick={() => setSelectedAnalysisRunId(null)}
                  className="text-xs font-semibold text-accent-green hover:opacity-80 transition-opacity"
                >
                  Close
                </button>
                </div>
                <AnalysisRunDetail
                  analysisRun={analysisRuns.find(r => r.id === selectedAnalysisRunId)!}
                  field={fields.find(f => f.id === selectedFieldId)}
                />
              </div>
            )}

          {/* Context, Technical Details & Decision Context Layers - Unified continuation */}
          <div className="dashboard-card mt-6" style={{ padding: 0 }}>
            <div style={{ padding: '24px' }}>
              {/* Context */}
              <div className="metadata-section-item">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="metadata-section-title">Context</h3>
                    <p className="metadata-section-description">External descriptive data</p>
              </div>
                {!showContext && (
                <button
                  onClick={handleLoadContext}
                  disabled={isLoadingContext}
                      className="metadata-action-button"
                >
                      {isLoadingContext ? 'Loading...' : 'Load'}
                </button>
              )}
            </div>
                {showContext && (
                  <div className="mt-5">
                    <ContextPanel context={context} isLoading={isLoadingContext} />
                  </div>
                )}
                {contextError && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-xs text-red-400">{contextError}</p>
        </div>
                )}
              </div>

              {/* Technical Details */}
              <div className="metadata-section-item">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="metadata-section-title">Technical Details</h3>
                    <p className="metadata-section-description">Inference provenance and trace</p>
              </div>
                {!showProvenance && (
                <button
                  onClick={handleShowProvenance}
                      className="metadata-action-button"
                >
                      View
                </button>
              )}
            </div>
                {showProvenance && selectedAnalysisRunId && (
                  <div className="mt-5">
                    <ProvenancePanel
                      fieldId={selectedFieldId}
                      windowStart={analysisRuns.find(r => r.id === selectedAnalysisRunId)?.windowStart || ''}
                      windowEnd={analysisRuns.find(r => r.id === selectedAnalysisRunId)?.windowEnd || ''}
                    />
        </div>
                )}
              </div>

            </div>
          </div>
        </aside>
      </div>

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
