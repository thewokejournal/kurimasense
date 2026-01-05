'use client'

/**
 * Provenance Panel Component
 * Phase 6.1 — Provenance & Audit Expansion
 * 
 * Displays view-time provenance data showing HOW inference was produced.
 * Hidden by default, revealed via explicit user action.
 * Shows mechanical reasoning only, not real-world causes or implications.
 */

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { ChevronDown, ChevronRight, Code } from 'lucide-react'
import type {
  InferenceProvenance,
  RuleTrace,
  SignalLineage,
  CategoryProvenance,
} from '@/app/lib/api'

interface ProvenancePanelProps {
  provenance: InferenceProvenance | null
  isLoading?: boolean
}

export default function ProvenancePanel({ provenance, isLoading }: ProvenancePanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  if (isLoading) {
    return (
      <Card className="surface-soft p-4 border-l-2" style={{ borderLeftColor: 'var(--border-subtle)' }}>
        <div className="flex items-start gap-2">
          <Code className="w-4 h-4 mt-0.5 opacity-40" />
          <div className="flex-1">
            <h3 className="font-semibold tracking-tight mb-1 text-xs uppercase text-muted">
              Technical Details
            </h3>
            <p className="meta-text text-xs">Loading provenance data...</p>
          </div>
        </div>
      </Card>
    )
  }

  if (!provenance) {
    return null
  }

  const renderRuleTrace = (rule: RuleTrace) => {
    const contributesToLabels = rule.contributesTo.map(c => {
      switch (c) {
        case 'status': return 'Status'
        case 'confidence': return 'Confidence'
        case 'category': return 'Category'
        case 'trend': return 'Trend'
        default: return c
      }
    }).join(', ')

    return (
      <div key={rule.ruleId} className="py-2 border-b border-border-subtle last:border-b-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-muted opacity-70">{rule.ruleId}</span>
              <span className={`text-xs ${rule.evaluated ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                {rule.evaluated ? 'Evaluated' : 'Not evaluated'}
              </span>
            </div>
            <p className="text-xs text-primary mb-1">{rule.ruleName}</p>
            {rule.outcome !== undefined && (
              <p className="text-xs text-muted">Outcome: {String(rule.outcome)}</p>
            )}
            <p className="text-xs text-muted opacity-70">Contributes to: {contributesToLabels}</p>
          </div>
        </div>
      </div>
    )
  }

  const renderSignalLineage = (signal: SignalLineage) => {
    return (
      <div key={`${signal.signalType}-${signal.timestamp}`} className="py-1.5 border-b last:border-b-0" style={{ borderBottomColor: 'var(--border-subtle)' }}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted opacity-70">{signal.signalType}</span>
            <span className="text-xs text-muted">
              {new Date(signal.timestamp).toLocaleString()}
            </span>
            {signal.dataQuality && (
              <span className="text-xs text-muted opacity-70">({signal.dataQuality})</span>
            )}
          </div>
          <span className={`text-xs ${signal.present ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
            {signal.present ? 'Present' : 'Absent'}
          </span>
        </div>
      </div>
    )
  }

  const renderCategoryProvenance = (category: CategoryProvenance) => {
    return (
      <div key={category.category} className="py-2 border-b last:border-b-0" style={{ borderBottomColor: 'var(--border-subtle)' }}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary mb-1">{category.category}</p>
            <p className="text-xs text-muted mb-1">
              Emitted by rules: {category.emittedBy.join(', ')}
            </p>
            <p className="text-xs text-muted opacity-70">
              {new Date(category.emittedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="surface-soft p-4 border-l-2" style={{ borderLeftColor: 'var(--border-subtle)' }}>
      <div className="flex items-start gap-2">
        <Code className="w-4 h-4 mt-0.5 opacity-40" />
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold tracking-tight mb-1 text-xs uppercase text-muted">
              Technical Details
            </h3>
            <p className="meta-text text-xs mb-3 opacity-70">
              Inference trace showing mechanical reasoning. Does not explain real-world causes or implications.
            </p>
          </div>

          {/* Rule Traces */}
          <div>
            <button
              onClick={() => toggleSection('rules')}
              className="w-full flex items-center justify-between py-2 text-left"
            >
              <span className="text-xs font-medium text-primary">Rule Traces</span>
              {expandedSections.has('rules') ? (
                <ChevronDown className="w-3 h-3 opacity-50" />
              ) : (
                <ChevronRight className="w-3 h-3 opacity-50" />
              )}
            </button>
            {expandedSections.has('rules') && (
              <div className="mt-2 space-y-1">
                {provenance.ruleTraces.map(renderRuleTrace)}
              </div>
            )}
          </div>

          {/* Signal Lineage */}
          <div>
            <button
              onClick={() => toggleSection('signals')}
              className="w-full flex items-center justify-between py-2 text-left"
            >
              <span className="text-xs font-medium text-primary">Signal Lineage</span>
              {expandedSections.has('signals') ? (
                <ChevronDown className="w-3 h-3 opacity-50" />
              ) : (
                <ChevronRight className="w-3 h-3 opacity-50" />
              )}
            </button>
            {expandedSections.has('signals') && (
              <div className="mt-2 space-y-1">
                {provenance.signalLineage.map(renderSignalLineage)}
              </div>
            )}
          </div>

          {/* Category Provenance */}
          <div>
            <button
              onClick={() => toggleSection('categories')}
              className="w-full flex items-center justify-between py-2 text-left"
            >
              <span className="text-xs font-medium text-primary">Category Provenance</span>
              {expandedSections.has('categories') ? (
                <ChevronDown className="w-3 h-3 opacity-50" />
              ) : (
                <ChevronRight className="w-3 h-3 opacity-50" />
              )}
            </button>
            {expandedSections.has('categories') && (
              <div className="mt-2 space-y-1">
                {provenance.categoryProvenance.map(renderCategoryProvenance)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

