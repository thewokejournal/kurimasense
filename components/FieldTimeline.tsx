/**
 * FieldTimeline Component
 * 
 * Displays a chronological list of field timeline entries.
 */

import { TimelineEntry } from '@/lib/timeline'

interface FieldTimelineProps {
  entries: TimelineEntry[]
  // TODO: Phase 4 - Wire these callbacks to UI state management
  onEntryHover?: (insightId: string | null) => void
  onEntrySelect?: (insightId: string) => void
}

export function FieldTimeline({ entries, onEntryHover, onEntrySelect }: FieldTimelineProps) {
  // Sort entries by timestamp, newest first
  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  if (entries.length === 0) {
    return (
      <div className="text-center py-6" style={{ color: 'rgba(230, 238, 248, 0.5)', fontSize: '13px' }}>
        No timeline entries available
      </div>
    )
  }

  return (
    <div className="max-h-80 overflow-y-auto space-y-2.5">
      {sortedEntries.map((entry) => (
        <TimelineEntryItem 
          key={entry.insightId} 
          entry={entry}
          onHover={onEntryHover}
          onSelect={onEntrySelect}
        />
      ))}
    </div>
  )
}

interface TimelineEntryItemProps {
  entry: TimelineEntry
  onHover?: (insightId: string | null) => void
  onSelect?: (insightId: string) => void
}

function TimelineEntryItem({ entry, onHover, onSelect }: TimelineEntryItemProps) {
  const relativeTime = getRelativeTime(entry.timestamp)
  const severityColor = getSeverityColor(entry.severity)
  const confidenceColor = getConfidenceColor(entry.confidence)

  return (
    <div 
      className="flex gap-2.5 py-2 border-b last:border-0" 
      style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}
      onMouseEnter={() => onHover?.(entry.insightId)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onSelect?.(entry.insightId)}
    >
      {/* Severity indicator */}
      <div className="flex-shrink-0 mt-0.5">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: severityColor }}
          aria-label={`Severity: ${entry.severity}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="label-text" style={{ marginBottom: '4px' }}>
          {entry.insightType}
        </div>
        <div className="confidence-indicator" style={{ fontSize: '9px', opacity: 0.45 }}>
          <span className="confidence-dot" style={{ backgroundColor: confidenceColor }} />
          <span>{relativeTime} · {entry.severity}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Get relative time string from ISO timestamp
 */
function getRelativeTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return diffMinutes <= 1 ? 'Just now' : `${diffMinutes}m ago`
    }
    return diffHours === 1 ? '1h ago' : `${diffHours}h ago`
  }
  
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return weeks === 1 ? '1w ago' : `${weeks}w ago`
  }
  
  const months = Math.floor(diffDays / 30)
  return months === 1 ? '1mo ago' : `${months}mo ago`
}

/**
 * Get color for severity level
 */
function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return '#ef4444'
    case 'high':
      return '#f97316'
    case 'medium':
      return '#f59e0b'
    case 'low':
      return '#3b82f6'
    case 'info':
      return '#10b981'
    default:
      return '#6b7280'
  }
}

/**
 * Get color for confidence level
 */
function getConfidenceColor(confidence: string): string {
  switch (confidence.toLowerCase()) {
    case 'high':
      return '#10b981'
    case 'medium':
      return '#f59e0b'
    case 'low':
      return '#ef4444'
    default:
      return '#6b7280'
  }
}
