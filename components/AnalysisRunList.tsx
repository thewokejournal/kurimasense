'use client'

/**
 * AnalysisRunList Component
 * Phase B — Replay & Inspection Polish
 * 
 * Displays all AnalysisRuns for a selected Field in chronological order.
 * Shows windowStart, windowEnd, and createdAt for each run.
 * Selection leads to detailed replay view.
 * 
 * Phase B: Read-only, calm, analytical. No comparisons, no privilege for latest.
 */

import { Calendar } from 'lucide-react'
import type { AnalysisRun } from '@/app/lib/api'

interface AnalysisRunListProps {
  analysisRuns: AnalysisRun[]
  selectedAnalysisRunId: string | null
  onSelectAnalysisRun: (runId: string) => void
}

export default function AnalysisRunList({
  analysisRuns,
  selectedAnalysisRunId,
  onSelectAnalysisRun,
}: AnalysisRunListProps) {
  // Phase B: Order chronologically by createdAt (most recent first)
  // Backend already returns runs ordered by created_at DESC (backend/src/db/client.ts line 225)
  // Sorting here ensures chronological order even if backend ordering changes
  const orderedRuns = [...analysisRuns].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  if (orderedRuns.length === 0) {
    return (
      <div className="metric-card">
        <div className="metric-content">
          <p className="metric-meta text-center">
            No analysis runs available for this field.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="metric-section">
      {orderedRuns.map((run) => {
        const createdAtDate = new Date(run.createdAt)
        const windowStartDate = new Date(run.windowStart)
        const windowEndDate = new Date(run.windowEnd)
        const isSelected = run.id === selectedAnalysisRunId

        return (
          <div
            key={run.id}
            className={`metric-card analysis-run-card cursor-pointer ${
              isSelected ? 'metric-card-primary' : ''
            }`}
            onClick={() => onSelectAnalysisRun(run.id)}
          >
            <div className="metric-icon">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="metric-content">
              <div className="metric-label">Time Window</div>
              <div className="metric-value-primary">
                {windowStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {windowStartDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {windowEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {windowEndDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="metric-meta">
                Created {createdAtDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              {isSelected && (
                <div className="metric-meta mt-1.5 pt-1.5 border-t border-border-subtle">
                  Selected for inspection
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

