'use client'

/**
 * Context Panel Component
 * Phase 5 — Context Expansion
 * 
 * Displays external, read-only context data for optional reference alongside inference.
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
      <Card className="bg-surface-elevated p-5 border border-border-subtle rounded-lg">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent-green/10 border border-accent-green/30 flex items-center justify-center flex-shrink-0 animate-pulse">
            <Info className="w-5 h-5 text-accent-green" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold tracking-tight mb-2 text-base text-primary">
              Context Data
            </h3>
            <p className="text-secondary text-sm">Loading context data...</p>
          </div>
        </div>
      </Card>
    )
  }

  if (!context) {
    return null
  }

  return (
    <Card className="bg-surface-elevated p-5 border border-border-subtle rounded-lg">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-accent-green/10 border border-accent-green/30 flex items-center justify-center flex-shrink-0">
          <Info className="w-5 h-5 text-accent-green" />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="font-semibold tracking-tight mb-2 text-base text-primary">
              Context Data
            </h3>
            <p className="text-secondary text-sm mb-4 leading-relaxed">
              Additional descriptive information. Factual data only. Does not modify, explain, or influence inference.
            </p>
          </div>

          {/* Data Source */}
          <div className="bg-surface-soft/50 rounded-lg p-3 border border-border-subtle">
            <span className="text-xs uppercase tracking-wider text-muted font-semibold block mb-1.5">Data Source</span>
            <p className="text-primary font-medium">{context.source}</p>
          </div>

          {/* Time Window */}
          <div className="bg-surface-soft/50 rounded-lg p-3 border border-border-subtle">
            <span className="text-xs uppercase tracking-wider text-muted font-semibold block mb-1.5">Time Window</span>
            <p className="text-primary font-medium">
              {new Date(context.timeWindow.start).toLocaleDateString()} — {new Date(context.timeWindow.end).toLocaleDateString()}
            </p>
          </div>

          {/* Freshness */}
          <div className="bg-surface-soft/50 rounded-lg p-3 border border-border-subtle">
            <span className="text-xs uppercase tracking-wider text-muted font-semibold block mb-1.5">Fetched</span>
            <p className="text-primary font-medium">
              {new Date(context.fetchedAt).toLocaleString()}
            </p>
          </div>

          {/* Context Data */}
          <div className="pt-4 border-t border-border-subtle">
            <span className="text-xs uppercase tracking-wider text-muted font-semibold mb-3 block">Data Points</span>
            <div className="space-y-2.5">
              {Object.entries(context.data).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 px-3 bg-surface-soft/30 rounded border border-border-subtle hover:bg-surface-hover transition-colors">
                  <span className="text-secondary text-sm font-medium">{key}</span>
                  <span className="text-primary text-sm font-semibold tabular-nums">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

