'use client'

/**
 * AnalysisRunDetail Component
 * Phase B — Replay & Inspection Polish
 * 
 * Displays stored inference exactly as recorded (replay view).
 * Shows status, trend, confidence, categories (verbatim), explanation (verbatim).
 * Shows Field name, windowStart/windowEnd, createdAt.
 * Reinforces that analysis is immutable and historical.
 * 
 * Phase B: Read-only, calm, analytical. No modifications, no actions.
 */

import { Card } from '@/components/ui/card'
import { Clock, Calendar, Map, Info, FileText } from 'lucide-react'
import { ConfidenceBadge } from '@/components/ConfidenceBadge'
import { formatGeneratedAt } from '@/app/lib/inferenceAdapter'
import type { AnalysisRun, Field } from '@/app/lib/api'
import type { InferenceResponse } from '@/app/types/inference'

interface AnalysisRunDetailProps {
  analysisRun: AnalysisRun
  field?: Field
}

export default function AnalysisRunDetail({
  analysisRun,
  field,
}: AnalysisRunDetailProps) {
  const inference = analysisRun.inference as InferenceResponse
  const createdAtDate = new Date(analysisRun.createdAt)
  const windowStartDate = new Date(analysisRun.windowStart)
  const windowEndDate = new Date(analysisRun.windowEnd)

  // Phase B: Capitalize enum values for display only (presentation, not semantic change)
  // All values are displayed verbatim - capitalization is UI convention only
  const capitalize = (s: string): string => {
    if (!s || s.length === 0) return s
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  return (
    <div className="space-y-6">
      {/* Phase B: Analysis metadata - Field, Time Window, Created At */}
      <Card className="surface-soft p-5 border-l-4 border-border-subtle">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-4">Analysis Record</h2>
            <p className="text-xs text-muted mb-4">
              Historical analysis record. Immutable and cannot be modified.
            </p>
          </div>

          {field && (
            <div className="flex items-start gap-3">
              <Map className="w-4 h-4 mt-0.5 opacity-50" />
              <div>
                <p className="text-xs text-muted mb-1">Field</p>
                <p className="text-sm font-medium">{field.name}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 mt-0.5 opacity-50" />
            <div>
              <p className="text-xs text-muted mb-1">Time Window</p>
              <p className="text-sm font-medium">
                {windowStartDate.toLocaleDateString()} {windowStartDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {windowEndDate.toLocaleDateString()} {windowEndDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 mt-0.5 opacity-50" />
            <div>
              <p className="text-xs text-muted mb-1">Created At</p>
              <p className="text-sm font-medium">
                {createdAtDate.toLocaleDateString()} {createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Phase B: Inference status, trend, confidence - displayed verbatim from stored data */}
      <Card className="surface-soft p-5">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold mb-1">Status</h3>
            <p className="text-sm text-muted mb-2">The stored status value</p>
            <p className="text-lg font-medium">
              {capitalize(inference.status)}
            </p>
          </div>

          <div className="pt-4 border-t" style={{ borderTopColor: 'var(--border-subtle)' }}>
            <h3 className="text-base font-semibold mb-1">Trend</h3>
            <p className="text-sm text-muted mb-2">The stored trend value</p>
            <p className="text-lg font-medium">
              {capitalize(inference.trend)}
            </p>
          </div>

          <div className="pt-4 border-t" style={{ borderTopColor: 'var(--border-subtle)' }}>
            <h3 className="text-base font-semibold mb-1">Confidence</h3>
            <p className="text-sm text-muted mb-2">The stored confidence value</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-medium">
                {capitalize(inference.confidence)}
              </p>
              <ConfidenceBadge
                confidence={
                  inference.confidence === 'high' ? 0.9 :
                  inference.confidence === 'medium' ? 0.6 : 0.3
                }
                source="satellite"
              />
            </div>
            <p className="text-xs text-muted mt-2">
              Generated {formatGeneratedAt(inference.generatedAt)}
            </p>
          </div>
        </div>
      </Card>

      {/* Phase B: Categories displayed verbatim (all categories, no filtering or reordering) */}
      {inference.categories && inference.categories.length > 0 && (
        <Card className="surface-soft p-5">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-1">Categories</h3>
              <p className="text-sm text-muted mb-4">
                Stored category values displayed exactly as recorded
              </p>
            </div>
            {inference.categories.map((cat, index) => (
              <div
                key={index}
                className={index > 0 ? 'pt-4 border-t' : ''}
                style={index > 0 ? { borderTopColor: 'var(--border-subtle)' } : {}}
              >
                <div className="flex items-start gap-2 mb-2">
                  <Info className="w-4 h-4 mt-0.5 opacity-50 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">
                      {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}
                    </p>
                    <p className="text-sm text-muted">{cat.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Phase B: Explanation displayed verbatim (preserving whitespace) */}
      {inference.explanation && (
        <Card className="surface-soft p-5">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 mt-0.5 opacity-50 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-base font-semibold mb-1">Explanation</h3>
                <p className="text-sm text-muted mb-3">
                  Stored explanation text displayed exactly as recorded
                </p>
                <p className="text-sm whitespace-pre-wrap label-text">
                  {inference.explanation}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Phase B: Immutability reminder */}
      <Card className="surface-soft p-4 border-l-4 border-border-subtle">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 opacity-50 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted">
              This analysis record is immutable and historical. It represents the system's inference
              at the time of creation and cannot be modified, updated, or recomputed.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

