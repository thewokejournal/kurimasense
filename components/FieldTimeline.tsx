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
      <div className="text-center py-6 meta-text" style={{ opacity: 0.5 }}>
        No timeline entries available
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
  const formattedDate = formatDate(entry.timestamp)

  return (
    <div 
      className="pb-6 border-b last:border-0" 
      style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}
      onMouseEnter={() => onHover?.(entry.insightId)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onSelect?.(entry.insightId)}
    >
      {/* Date label */}
      <div className="meta-text uppercase tracking-wider mb-2" style={{ opacity: 0.4 }}>
        {formattedDate}
      </div>

      {/* Content group */}
      <div className="flex gap-3">
        {/* Severity indicator */}
        <div className="flex-shrink-0 mt-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: severityColor, opacity: 0.8 }}
            aria-label={`Severity: ${entry.severity}`}
          />
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          {/* Health event title */}
          <div className="font-semibold tracking-tight mb-1" style={{ fontSize: '14px' }}>
            {entry.insightType}
          </div>
          
          {/* Description */}
          <div className="label-text mb-2" style={{ opacity: 0.6, lineHeight: '1.5' }}>
            {getEventDescription(entry.severity, entry.insightType)}
          </div>

          {/* Confidence indicator */}
          <div className="confidence-indicator">
            <span className="confidence-dot" style={{ backgroundColor: confidenceColor }} />
            <span>{entry.confidence} confidence · {relativeTime}</span>
          </div>
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
 * Format date for timeline entry header
 */
function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

/**
 * Get descriptive text for event
 */
function getEventDescription(severity: string, insightType: string): string {
  // Generate a contextual description based on severity and type
  const severityLower = severity.toLowerCase()
  
  if (severityLower === 'critical' || severityLower === 'high') {
    return 'Immediate attention recommended to prevent crop stress or yield loss.'
  }
  if (severityLower === 'medium') {
    return 'Monitor closely over the next few days for any changes in conditions.'
  }
  if (severityLower === 'low') {
    return 'Minor variation detected, no immediate action required.'
  }
  return 'Field conditions within expected range.'
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
