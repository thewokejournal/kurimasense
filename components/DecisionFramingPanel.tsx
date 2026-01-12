'use client'

/**
 * Decision Framing Panel Component
 * Phase F — Decision Framing (Non-Directive)
 * 
 * Provides meta-level framing to help users understand what an analysis means
 * and what it does not mean, without prescribing actions or predicting outcomes.
 * 
 * STRICT RULES (NON-NEGOTIABLE):
 * - Static, deterministic content only (no dynamic suggestions)
 * - Category-based on status/trend/confidence only
 * - NO causes, actions, outcomes, or external data references
 * - NO prescriptive language ("should", "must", "recommended")
 * - Hidden by default, explicit user action required
 * - Must include all required disclaimers
 */

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Info, ChevronDown, ChevronRight } from 'lucide-react'
import type { InferenceResponse } from '@/app/types/inference'

interface DecisionFramingPanelProps {
  inference: InferenceResponse
}

/**
 * Generate static framing content based on inference categories
 * Content is deterministic and based solely on status/trend/confidence
 */
function generateFramingContent(inference: InferenceResponse) {
  const { status, trend, confidence } = inference

  // What this status IS
  const statusMeaning: Record<string, string> = {
    healthy: "This status reflects the system's assessment that available signals indicate favorable crop conditions within the analysis window.",
    watch: "This status reflects the system's assessment that available signals indicate conditions observed within the analysis window.",
    stressed: "This status reflects the system's assessment that available signals indicate unfavorable crop conditions within the analysis window.",
  }

  // What trend means
  const trendMeaning: Record<string, string> = {
    improving: "This trend reflects that available signals show progression toward more favorable conditions within the analysis window.",
    stable: "This trend reflects that available signals show minimal change in conditions within the analysis window.",
    declining: "This trend reflects that available signals show progression toward less favorable conditions within the analysis window.",
  }

  // What confidence means
  const confidenceMeaning: Record<string, string> = {
    high: "Confidence reflects signal completeness within the analysis window. High confidence indicates that sufficient signals were available for assessment.",
    medium: "Confidence reflects signal completeness within the analysis window. Medium confidence indicates that signals were partially available for assessment.",
    low: "Confidence reflects signal completeness within the analysis window. Low confidence indicates that limited signals were available for assessment.",
  }

  return {
    statusMeaning: statusMeaning[status] || statusMeaning.watch,
    trendMeaning: trendMeaning[trend] || trendMeaning.stable,
    confidenceMeaning: confidenceMeaning[confidence] || confidenceMeaning.medium,
  }
}

/**
 * Required disclaimers - must be explicit and visible
 */
const REQUIRED_DISCLAIMERS = [
  "The system does not give advice or recommendations.",
  "The system does not predict outcomes or future conditions.",
  "Responsibility for decisions remains with the user.",
  "This is one input among many that may inform your judgment.",
]

/**
 * What the inference IS NOT - explicit boundaries
 */
const INFERENCE_BOUNDARIES = [
  "This does not indicate what actions should be taken.",
  "This does not explain why conditions exist.",
  "This does not predict what will happen next.",
  "This does not reference factors outside the measured signals.",
]

export default function DecisionFramingPanel({ inference }: DecisionFramingPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const framing = generateFramingContent(inference)

  return (
    <Card className="surface-soft border-l-4 border-blue-200 dark:border-blue-900">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-accent/5 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 opacity-50 flex-shrink-0" />
          <div className="text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ letterSpacing: '0.08em' }}>
              How to Read This
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Understanding what this analysis means and does not mean
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 opacity-50 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 opacity-50 flex-shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {/* What This Analysis IS */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted" style={{ letterSpacing: '0.08em' }}>
              What This Analysis Represents
            </h4>
            <div className="space-y-2 text-sm label-text">
              <p><strong>Status ({inference.status}):</strong> {framing.statusMeaning}</p>
              <p><strong>Trend ({inference.trend}):</strong> {framing.trendMeaning}</p>
              <p><strong>Confidence ({inference.confidence}):</strong> {framing.confidenceMeaning}</p>
            </div>
          </div>

          {/* What This Analysis IS NOT */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted" style={{ letterSpacing: '0.08em' }}>
              What This Analysis Does Not Represent
            </h4>
            <ul className="space-y-1 text-sm label-text list-disc list-inside">
              {INFERENCE_BOUNDARIES.map((boundary, index) => (
                <li key={index}>{boundary}</li>
              ))}
            </ul>
          </div>

          {/* Required Disclaimers */}
          <div className="space-y-2 pt-2 border-t border-border-subtle">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted" style={{ letterSpacing: '0.08em' }}>
              System Limitations
            </h4>
            <ul className="space-y-1 text-sm label-text list-disc list-inside">
              {REQUIRED_DISCLAIMERS.map((disclaimer, index) => (
                <li key={index}>{disclaimer}</li>
              ))}
            </ul>
          </div>

          {/* Responsibility Statement */}
          <div className="bg-accent/10 p-3 rounded border border-border-subtle">
            <p className="text-xs text-muted">
              <strong>You may choose how to use this information.</strong> The system provides an assessment based on available signals. 
              It does not determine the correctness of any decision or action you may take.
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}

