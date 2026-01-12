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

import { Clock, Calendar, Map, Info, FileText } from 'lucide-react'
import { formatGeneratedAt } from '@/app/lib/inferenceAdapter'
import ProvenancePanel from '@/components/ProvenancePanel'
import DecisionFramingPanel from '@/components/DecisionFramingPanel'
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
    <div className="metric-section">
      {/* Phase B: Analysis metadata - Field, Time Window, Created At */}
      <div className="metric-card">
        <div className="metric-icon">
          <Map className="w-5 h-5" />
        </div>
        <div className="metric-content">
          <div className="metric-label">Field</div>
          <div className="metric-value-primary">
            {field?.name || 'Unknown Field'}
          </div>
          <div className="metric-meta">
            Historical analysis record. Immutable and cannot be modified.
          </div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="metric-content">
          <div className="metric-label">Time Window</div>
          <div className="metric-value-primary">
            {windowStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {windowStartDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {windowEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {windowEndDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon">
          <Clock className="w-5 h-5" />
        </div>
        <div className="metric-content">
          <div className="metric-label">Created At</div>
          <div className="metric-value-primary">
            {createdAtDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Phase B: Inference status, trend, confidence - displayed verbatim from stored data */}
      <div className="metric-card">
        <div className="metric-content">
          <div className="metric-label">Status</div>
          <div className="metric-value-primary">
            {capitalize(inference.status)}
          </div>
          <div className="metric-meta">The stored status value</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-content">
          <div className="metric-label">Trend</div>
          <div className="metric-value-primary">
            {capitalize(inference.trend)}
          </div>
          <div className="metric-meta">The stored trend value</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-content">
          <div className="metric-label">Confidence</div>
          <div className="metric-value-primary">
            {capitalize(inference.confidence)}
          </div>
          <div className="metric-meta">
            Generated {formatGeneratedAt(inference.generatedAt)}
          </div>
        </div>
      </div>

      {/* Phase B: Categories displayed verbatim (all categories, no filtering or reordering) */}
      {inference.categories && inference.categories.length > 0 && (
        <div className="metric-section">
          <div className="metric-section-header mb-4">
            <span className="meta-text uppercase tracking-wider text-xs">Categories</span>
          </div>
          {inference.categories.map((cat, index) => (
            <div key={index} className="metric-card">
              <div className="metric-icon">
                <Info className="w-5 h-5" />
              </div>
              <div className="metric-content">
                <div className="metric-label">
                  {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}
                </div>
                <div className="metric-value-primary">
                  {cat.message}
                </div>
                <div className="metric-meta">Stored category value displayed exactly as recorded</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Phase B: Explanation displayed verbatim (preserving whitespace) */}
      {inference.explanation && (
        <div className="metric-card">
          <div className="metric-icon">
            <FileText className="w-5 h-5" />
          </div>
          <div className="metric-content">
            <div className="metric-label">Explanation</div>
            <div className="metric-value-primary whitespace-pre-wrap" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              {inference.explanation}
            </div>
            <div className="metric-meta mt-2">Stored explanation text displayed exactly as recorded</div>
          </div>
        </div>
      )}

      {/* Phase F: Decision Framing Panel (Hidden by default, user must opt in) */}
      <DecisionFramingPanel inference={inference} />

      {/* Phase B: Immutability reminder */}
      <div className="metric-card">
        <div className="metric-icon">
          <Info className="w-5 h-5" />
        </div>
        <div className="metric-content">
          <div className="metric-meta">
            This analysis record is immutable and historical. It represents the system's inference
            at the time of creation and cannot be modified, updated, or recomputed.
          </div>
        </div>
      </div>

      {/* Phase C: Provenance Panel (Hidden by default, user must opt in) */}
      <ProvenancePanel
        fieldId={analysisRun.fieldId}
        windowStart={analysisRun.windowStart}
        windowEnd={analysisRun.windowEnd}
      />
    </div>
  )
}

