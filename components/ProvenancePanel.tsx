'use client'

/**
 * ProvenancePanel Component
 * Phase C — Provenance v1 (Minimal, Developer-Useful)
 * 
 * Displays mechanical inference provenance (rules evaluated and signals present)
 * without explaining causes, adding interpretation, or increasing authority.
 * 
 * Phase C: Hidden by default, user must explicitly opt in. Visually secondary.
 */

import { useState } from 'react'
import { ChevronDown, ChevronRight, Code, Radio } from 'lucide-react'
import { generateProvenance } from '@/app/lib/api'
import type { InferenceProvenance } from '@/app/lib/api'

interface ProvenancePanelProps {
  fieldId: string
  windowStart: string
  windowEnd: string
}

export default function ProvenancePanel({
  fieldId,
  windowStart,
  windowEnd,
}: ProvenancePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [provenance, setProvenance] = useState<InferenceProvenance | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleToggle = async () => {
    if (!isExpanded && !provenance && !isLoading) {
      // Load provenance on first expansion
      setIsLoading(true)
      setError(null)
      try {
        const data = await generateProvenance(fieldId, windowStart, windowEnd)
        setProvenance(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load provenance')
      } finally {
        setIsLoading(false)
      }
    }
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="metadata-content">
      {/* Phase C: Toggle/Disclosure Control - Hidden by default */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between text-left py-2 hover:opacity-80 transition-opacity"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 opacity-50" />
          ) : (
            <ChevronRight className="w-4 h-4 opacity-50" />
          )}
          <Code className="w-4 h-4 opacity-50" />
          <span className="text-sm text-secondary">Inference trace</span>
        </div>
      </button>

      {/* Phase C: Provenance content (only shown when expanded) */}
      {isExpanded && (
        <div className="mt-5 space-y-6">
          {isLoading && (
            <p className="text-sm text-secondary">Loading provenance data...</p>
          )}

          {error && (
            <p className="text-sm text-red-400">Error: {error}</p>
          )}

          {provenance && (
            <>
              {/* Phase C: Rule Evaluation List */}
              <div>
                <h3 className="affected-area-label mb-3 flex items-center gap-2">
                  <Radio className="w-3 h-3 opacity-50" />
                  Rule Evaluations
                </h3>
                <div className="space-y-2">
                  {provenance.ruleTraces.map((rule, index) => (
                    <div
                      key={rule.ruleId || index}
                      className="py-2.5 px-0"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted mb-0.5">
                            {rule.ruleId}
                          </p>
                          <p className="text-sm text-primary font-medium">{rule.ruleName}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="text-xs text-secondary font-medium">
                            {rule.evaluated ? 'true' : 'false'}
                          </span>
                        </div>
                      </div>
                      {rule.outcome !== undefined && (
                        <p className="text-xs text-secondary mt-1">
                          Outcome: {String(rule.outcome)}
                        </p>
                      )}
                      {rule.contributesTo.length > 0 && (
                        <p className="text-xs text-secondary mt-1">
                          Contributes to: {rule.contributesTo.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Phase C: Signal Presence List */}
              <div>
                <h3 className="affected-area-label mb-3 flex items-center gap-2">
                  <Radio className="w-3 h-3 opacity-50" />
                  Signal Presence
                </h3>
                <div className="space-y-2">
                  {provenance.signalLineage.length === 0 ? (
                    <p className="text-sm text-secondary">No signals present at inference time</p>
                  ) : (
                    provenance.signalLineage.map((signal, index) => (
                      <div
                        key={`${signal.signalType}-${signal.timestamp}-${index}`}
                        className="py-2.5 px-0"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-primary font-medium capitalize">
                              {signal.signalType}
                            </p>
                            {signal.timestamp && (
                              <p className="text-xs text-secondary mt-0.5">
                                {new Date(signal.timestamp).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <span className="text-xs text-secondary font-medium">
                              {signal.present ? 'present' : 'absent'}
                            </span>
                          </div>
                        </div>
                        {signal.dataQuality && (
                          <p className="text-xs text-secondary mt-1">
                            Quality: {signal.dataQuality}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Phase C: Category Provenance (shows which rules emitted each category) */}
              {provenance.categoryProvenance && provenance.categoryProvenance.length > 0 && (
                <div>
                  <h3 className="affected-area-label mb-3 flex items-center gap-2">
                    <Radio className="w-3 h-3 opacity-50" />
                    Category Provenance
                  </h3>
                  <div className="space-y-2">
                    {provenance.categoryProvenance.map((catProv, index) => (
                      <div
                        key={`${catProv.category}-${index}`}
                        className="py-2.5 px-0"
                      >
                        <p className="text-sm text-primary font-medium mb-1 capitalize">{catProv.category}</p>
                        {catProv.emittedBy && catProv.emittedBy.length > 0 && (
                          <p className="text-xs text-secondary">
                            Emitted by: {catProv.emittedBy.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
