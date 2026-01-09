'use client'

/**
 * Context Panel Component
 * Phase 5 — Context Expansion
 * 
 * Displays external, read-only context data for optional reference alongside inference.
 * Context is descriptive only and does not influence, modify, or explain inference.
 */

import { Info } from 'lucide-react'

export interface ContextData {
  source: string
  timeWindow: {
    start: string
    end: string
  }
  fetchedAt: string
  data: Record<string, any>
}

interface ContextPanelProps {
  context: ContextData | null
  isLoading?: boolean
}

export default function ContextPanel({ context, isLoading }: ContextPanelProps) {
  if (isLoading) {
    return (
      <div className="metadata-content">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-accent-green opacity-50 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-secondary">Loading context data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!context) {
    return null
  }

  return (
    <div className="metadata-content">
      <div className="space-y-5">
        {/* Data Source */}
        <div className="metadata-data-item">
          <span className="affected-area-label">Data Source</span>
          <p className="text-sm text-primary font-medium mt-1">{context.source}</p>
        </div>

        {/* Time Window */}
        <div className="metadata-data-item">
          <span className="affected-area-label">Time Window</span>
          <p className="text-sm text-primary font-medium mt-1">
            {new Date(context.timeWindow.start).toLocaleDateString()} — {new Date(context.timeWindow.end).toLocaleDateString()}
          </p>
        </div>

        {/* Freshness */}
        <div className="metadata-data-item">
          <span className="affected-area-label">Fetched</span>
          <p className="text-sm text-primary font-medium mt-1">
            {new Date(context.fetchedAt).toLocaleString()}
          </p>
        </div>

        {/* Context Data */}
        <div className="pt-4 border-t" style={{ borderTopColor: 'var(--border-subtle)' }}>
          <span className="affected-area-label mb-3 block">Data Points</span>
          <div className="space-y-2">
            {Object.entries(context.data).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2">
                <span className="text-sm text-secondary">{key}</span>
                <span className="text-sm text-primary font-semibold tabular-nums">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

