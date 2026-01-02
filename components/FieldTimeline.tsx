/**
 * FieldTimeline Component
 * 
 * Displays a chronological list of field timeline entries.
 */

import { TimelineEntry } from '@/lib/timeline'

interface FieldTimelineProps {
  entries: TimelineEntry[]
}

export function FieldTimeline({ entries }: FieldTimelineProps) {
  // Sort entries by timestamp, newest first
  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No timeline entries available
      </div>
    )
  }

  return (
    <div className="max-h-96 overflow-y-auto space-y-3 px-1">
      {sortedEntries.map((entry) => (
        <TimelineEntryItem key={entry.insightId} entry={entry} />
      ))}
    </div>
  )
}

interface TimelineEntryItemProps {
  entry: TimelineEntry
}

function TimelineEntryItem({ entry }: TimelineEntryItemProps) {
  const relativeTime = getRelativeTime(entry.timestamp)
  const severityColor = getSeverityColor(entry.severity)
  const confidenceColor = getConfidenceColor(entry.confidence)

  return (
    <div className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
      {/* Severity indicator */}
      <div className="flex-shrink-0 mt-1">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: severityColor }}
          aria-label={`Severity: ${entry.severity}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900 capitalize">
            {entry.severity}
          </span>
          <span className="text-xs text-gray-500 flex-shrink-0">
            {relativeTime}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          {entry.insightType}
        </div>
      </div>

      {/* Confidence dot */}
      <div className="flex-shrink-0 mt-1">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: confidenceColor }}
          aria-label={`Confidence: ${entry.confidence}`}
        />
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
