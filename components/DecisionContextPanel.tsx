'use client'

/**
 * Decision Context Panel Component
 * Phase 7 — Decision Framing
 * 
 * Displays non-actionable, read-only decision contexts to help users structure decision-making.
 * Hidden by default, revealed via explicit user action.
 * Clarifies considerations, uncertainties, and information gaps only.
 */

import { useState } from 'react'
import { ChevronDown, ChevronRight, AlertCircle } from 'lucide-react'
import type {
  DecisionContext,
  DecisionContextResponse,
} from '@/app/lib/api'

interface DecisionContextPanelProps {
  decisionContexts: DecisionContextResponse | null
  isLoading?: boolean
}

export default function DecisionContextPanel({ decisionContexts, isLoading }: DecisionContextPanelProps) {
  const [expandedContexts, setExpandedContexts] = useState<Set<string>>(new Set())

  const toggleContext = (domain: string) => {
    const newExpanded = new Set(expandedContexts)
    if (newExpanded.has(domain)) {
      newExpanded.delete(domain)
    } else {
      newExpanded.add(domain)
    }
    setExpandedContexts(newExpanded)
  }

  if (isLoading) {
    return (
      <div className="metadata-content">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 opacity-40" />
          <div className="flex-1">
            <p className="text-sm text-secondary">Loading decision contexts...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!decisionContexts) {
    return null
  }

  return (
    <div className="metadata-content">
      <div className="space-y-5">
        {/* Responsibility Statement */}
        <div className="pb-4 border-b" style={{ borderBottomColor: 'var(--border-subtle)' }}>
          <p className="text-xs text-secondary italic leading-relaxed">{decisionContexts.responsibilityStatement}</p>
        </div>

        {/* Decision Contexts */}
        <div className="space-y-3">
          {decisionContexts.contexts.map((context) => (
            <div key={context.domain}>
              <button
                onClick={() => toggleContext(context.domain)}
                className="w-full flex items-center justify-between py-2 text-left hover:opacity-80 transition-opacity"
              >
                <span className="text-sm font-medium text-primary">{context.domain}</span>
                {expandedContexts.has(context.domain) ? (
                  <ChevronDown className="w-3 h-3 opacity-50" />
                ) : (
                  <ChevronRight className="w-3 h-3 opacity-50" />
                )}
              </button>
              {expandedContexts.has(context.domain) && (
                <div className="mt-3 space-y-4 pl-4 border-l" style={{ borderLeftColor: 'var(--border-subtle)' }}>
                  {/* Inference References */}
                  <div>
                    <p className="affected-area-label mb-2">Inference References</p>
                    <div className="space-y-1.5">
                      {context.inferenceReferences.map((ref, idx) => (
                        <div key={idx} className="text-xs text-primary">
                          <span className="font-mono opacity-60">{ref.field}:</span>{' '}
                          <span>{ref.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Considerations */}
                  <div>
                    <p className="affected-area-label mb-2">
                      Information that may be relevant includes:
                    </p>
                    <ul className="space-y-1.5">
                      {context.considerations.map((consideration, idx) => (
                        <li key={idx} className="text-xs text-primary list-disc list-inside leading-relaxed">
                          {consideration}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Uncertainties */}
                  <div>
                    <p className="affected-area-label mb-2">Uncertainties</p>
                    <ul className="space-y-1.5">
                      {context.uncertainties.map((uncertainty, idx) => (
                        <li key={idx} className="text-xs text-primary list-disc list-inside leading-relaxed">
                          {uncertainty}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

