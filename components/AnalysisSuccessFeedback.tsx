'use client'

/**
 * Analysis Success Feedback Component
 * Phase A — Analysis Execution Hardening
 * 
 * Shows clear success state after analysis execution.
 * Displays createdAt, windowStart, windowEnd.
 * Reinforces that analysis is final and immutable.
 */

import { Card } from '@/components/ui/card'
import { CheckCircle, Calendar, Clock, Info } from 'lucide-react'
import type { AnalysisRun } from '@/app/lib/api'

interface AnalysisSuccessFeedbackProps {
  analysisRun: AnalysisRun
  onClose: () => void
  fieldName?: string
  isCurrentField?: boolean
}

export default function AnalysisSuccessFeedback({
  analysisRun,
  onClose,
  fieldName,
  isCurrentField = false,
}: AnalysisSuccessFeedbackProps) {
  const createdAtDate = new Date(analysisRun.createdAt)
  const windowStartDate = new Date(analysisRun.windowStart)
  const windowEndDate = new Date(analysisRun.windowEnd)

  return (
    <Card className="surface-soft p-6 border-l-4 border-green-500">
      <div className="flex items-start gap-3 mb-4">
        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-base mb-1">Analysis Created Successfully</h3>
          <p className="text-sm text-muted mb-4">
            The analysis has been created and stored. This analysis is final and immutable.
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-muted hover:text-primary"
        >
          <span className="text-sm">Close</span>
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 mt-0.5 opacity-50" />
          <div>
            <p className="text-xs text-muted mb-1">Created At</p>
            <p className="text-sm font-medium">{createdAtDate.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="w-4 h-4 mt-0.5 opacity-50" />
          <div>
            <p className="text-xs text-muted mb-1">Time Window</p>
            <p className="text-sm font-medium">
              {windowStartDate.toLocaleString()} — {windowEndDate.toLocaleString()}
            </p>
          </div>
        </div>

        {fieldName && (
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 opacity-50" />
            <div>
              <p className="text-xs text-muted mb-1">Field</p>
              <p className="text-sm font-medium">{fieldName}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 pt-2 border-t" style={{ borderTopColor: 'var(--border-subtle)' }}>
          <Info className="w-4 h-4 mt-0.5 opacity-50" />
          <div>
            <p className="text-xs text-muted mb-1">
              {isCurrentField 
                ? 'This analysis is now available in the analysis dropdown above. It is immutable and cannot be modified, updated, or recomputed.'
                : 'This analysis is immutable and cannot be modified, updated, or recomputed. Switch to this field to view it.'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

