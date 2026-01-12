'use client'

/**
 * Right Sidebar Component
 * Contains optional layers: Context, Provenance, Decision Context
 */

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import ContextPanel from '@/components/ContextPanel'
import ProvenancePanel from '@/components/ProvenancePanel'
import type { ContextData } from '@/app/lib/api'

interface RightSidebarProps {
  // Context
  context: ContextData | null
  isLoadingContext: boolean
  contextError: string | null
  onLoadContext: () => void
  showContext: boolean

  // Provenance
  showProvenance: boolean
  onShowProvenance: () => void
  fieldId?: string
  windowStart?: string
  windowEnd?: string

}

export function RightSidebar({
  context,
  isLoadingContext,
  contextError,
  onLoadContext,
  showContext,
  showProvenance,
  onShowProvenance,
  fieldId,
  windowStart,
  windowEnd,
}: RightSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    context: false,
    provenance: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="right-sidebar">
      <div className="px-2 mb-3">
        <span className="meta-text uppercase tracking-wider text-xs">Optional Layers</span>
      </div>

      {/* Context Layer */}
      <div className="bg-surface-elevated border border-border-subtle rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('context')}
          className="w-full flex items-center justify-between p-4 hover:bg-surface-hover transition-colors"
        >
          <div>
            <div className="text-sm font-semibold text-primary">Context</div>
            <div className="text-xs text-muted mt-0.5">External descriptive data</div>
          </div>
          {expandedSections.context ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </button>
        
        {expandedSections.context && (
          <div className="border-t border-border-subtle p-4">
            {!showContext ? (
              <button
                onClick={onLoadContext}
                disabled={isLoadingContext}
                className="btn-secondary text-sm w-full"
              >
                {isLoadingContext ? 'Loading...' : 'Load Context'}
              </button>
            ) : (
              <ContextPanel context={context} isLoading={isLoadingContext} />
            )}
            {contextError && (
              <p className="text-xs text-red-400 mt-2">{contextError}</p>
            )}
          </div>
        )}
      </div>

      {/* Provenance Layer */}
      <div className="bg-surface-elevated border border-border-subtle rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('provenance')}
          className="w-full flex items-center justify-between p-4 hover:bg-surface-hover transition-colors"
        >
          <div>
            <div className="text-sm font-semibold text-primary">Technical Details</div>
            <div className="text-xs text-muted mt-0.5">Inference trace</div>
          </div>
          {expandedSections.provenance ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </button>
        
        {expandedSections.provenance && (
          <div className="border-t border-border-subtle p-4">
            {!showProvenance ? (
              <button
                onClick={onShowProvenance}
                className="btn-secondary text-sm w-full"
              >
                Show Technical Details
              </button>
            ) : fieldId && windowStart && windowEnd ? (
              <ProvenancePanel
                fieldId={fieldId}
                windowStart={windowStart}
                windowEnd={windowEnd}
              />
            ) : (
              <p className="text-xs text-muted">No analysis selected</p>
            )}
          </div>
        )}
      </div>

    </div>
  )
}

