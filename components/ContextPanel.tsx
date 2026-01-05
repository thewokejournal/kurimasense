'use client'

/**
 * Context Panel Component
 * Phase 5 — Context Expansion
 * 
 * Displays external, read-only context data that helps users understand inference.
 * Context is descriptive only and does not influence, modify, or explain inference.
 */

import { Card } from '@/components/ui/card'
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
      <Card className="surface-soft p-5 border-l-4" style={{ borderLeftColor: 'var(--border-subtle)' }}>
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 mt-0.5 opacity-50" />
          <div className="flex-1">
            <h3 className="font-semibold tracking-tight mb-2 text-sm uppercase text-muted">
              Context
            </h3>
            <p className="meta-text">Loading context data...</p>
          </div>
        </div>
      </Card>
    )
  }

  if (!context) {
    return null
  }

  return (
    <Card className="surface-soft p-5 border-l-4 border-border-subtle">
      <div className="flex items-start gap-3">
        <Info className="w-4 h-4 mt-0.5 opacity-50" />
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold tracking-tight mb-2 text-sm uppercase text-muted">
              Context
            </h3>
            <p className="meta-text text-xs mb-3 opacity-70">
              Additional descriptive information. Does not modify or explain inference.
            </p>
          </div>

          {/* Data Source */}
          <div>
            <span className="label-text text-xs uppercase tracking-wider opacity-60">Data Source</span>
            <p className="meta-text mt-1">{context.source}</p>
          </div>

          {/* Time Window */}
          <div>
            <span className="label-text text-xs uppercase tracking-wider opacity-60">Time Window</span>
            <p className="meta-text mt-1">
              {new Date(context.timeWindow.start).toLocaleDateString()} — {new Date(context.timeWindow.end).toLocaleDateString()}
            </p>
          </div>

          {/* Freshness */}
          <div>
            <span className="label-text text-xs uppercase tracking-wider opacity-60">Fetched</span>
            <p className="meta-text mt-1">
              {new Date(context.fetchedAt).toLocaleString()}
            </p>
          </div>

          {/* Context Data */}
          <div className="pt-2 border-t" style={{ borderTopColor: 'var(--border-subtle)' }}>
            <span className="label-text text-xs uppercase tracking-wider opacity-60 mb-2 block">Data</span>
            <div className="space-y-2">
              {Object.entries(context.data).map(([key, value]) => (
                <div key={key} className="flex justify-between items-start">
                  <span className="meta-text text-xs opacity-70">{key}</span>
                  <span className="meta-text text-xs font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

