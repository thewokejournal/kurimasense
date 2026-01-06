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

import { Card } from '@/components/ui/card'
import { Clock, Calendar } from 'lucide-react'
import type { AnalysisRun } from '@/app/lib/api'

interface AnalysisRunListProps {
  analysisRuns: AnalysisRun[]
  selectedAnalysisRunId: string | null
  onSelectAnalysisRun: (runId: string) => void
  fieldName?: string
}

export default function AnalysisRunList({
  analysisRuns,
  selectedAnalysisRunId,
  onSelectAnalysisRun,
  fieldName,
}: AnalysisRunListProps) {
  // Phase B: Order chronologically by createdAt (most recent first)
  // Backend already returns runs ordered by created_at DESC (backend/src/db/client.ts line 225)
  // Sorting here ensures chronological order even if backend ordering changes
  const orderedRuns = [...analysisRuns].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  if (orderedRuns.length === 0) {
    return (
      <Card className="surface-soft p-6">
        <p className="text-sm text-muted text-center">
          No analysis runs available for this field.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {orderedRuns.map((run) => {
        const createdAtDate = new Date(run.createdAt)
        const windowStartDate = new Date(run.windowStart)
        const windowEndDate = new Date(run.windowEnd)
        const isSelected = run.id === selectedAnalysisRunId

        return (
          <Card
            key={run.id}
            className={`surface-soft p-4 cursor-pointer transition-colors ${
              isSelected
                ? 'border-l-4 border-blue-500'
                : 'hover:bg-background-secondary'
            }`}
            onClick={() => onSelectAnalysisRun(run.id)}
          >
            <div className="space-y-3">
              {/* Phase B: Clear display of time window */}
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 mt-0.5 opacity-50 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted mb-1">Time Window</p>
                  <p className="text-sm font-medium">
                    {windowStartDate.toLocaleDateString()} {windowStartDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {windowEndDate.toLocaleDateString()} {windowEndDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Phase B: Clear display of when analysis was created */}
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 opacity-50 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted mb-1">Created At</p>
                  <p className="text-sm font-medium">
                    {createdAtDate.toLocaleDateString()} {createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Phase B: Visual indicator for selected run (subtle, not emphasis) */}
              {isSelected && (
                <div className="text-xs text-muted pt-2 border-t" style={{ borderTopColor: 'var(--border-subtle)' }}>
                  Selected for inspection
                </div>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

