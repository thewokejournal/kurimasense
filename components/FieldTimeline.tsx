/**
 * FieldTimeline Component
 * 
 * Displays a chronological list of field timeline entries.
 */

'use client'

import { motion } from 'framer-motion'
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-8 meta-text" 
        style={{ opacity: 0.5 }}
      >
        No timeline entries available
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="timeline-section"
    >
      {/* Entries */}
      <div className="metric-section">
        {sortedEntries.map((entry, index) => (
          <TimelineEntryItem 
            key={entry.insightId} 
            entry={entry}
            index={index}
            onHover={onEntryHover}
            onSelect={onEntrySelect}
          />
        ))}
      </div>
    </motion.div>
  )
}

interface TimelineEntryItemProps {
  entry: TimelineEntry
  index: number
  onHover?: (insightId: string | null) => void
  onSelect?: (insightId: string) => void
}

function TimelineEntryItem({ entry, index, onHover, onSelect }: TimelineEntryItemProps) {
  const relativeTime = getRelativeTime(entry.timestamp)
  const severityColor = getSeverityColor(entry.severity)
  const confidenceColor = getConfidenceColor(entry.confidence)
  const formattedDate = formatDate(entry.timestamp)

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03, ease: 'easeOut' }}
      className="metric-card timeline-entry-card cursor-pointer"
      onMouseEnter={() => onHover?.(entry.insightId)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onSelect?.(entry.insightId)}
    >
      {/* Severity Indicator Icon */}
      <div 
        className="metric-icon timeline-severity-icon"
        style={{ 
          backgroundColor: `${severityColor}15`,
          borderColor: `${severityColor}40`,
        }}
        aria-label={`Severity: ${entry.severity}`}
      >
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: severityColor }}
        />
      </div>

      {/* Content */}
      <div className="metric-content">
        {/* Date label - matches metric-label */}
        <div className="metric-label">
          {formattedDate}
        </div>

        {/* Health event title - 16px semibold */}
        <div className="timeline-entry-title">
          {entry.insightType}
        </div>
        
        {/* Description - 14px regular with increased line-height */}
        <div className="timeline-entry-description">
          {getEventDescription(entry.severity, entry.insightType)}
        </div>

        {/* Confidence and time metadata - subtle separator */}
        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <span 
            className="w-1.5 h-1.5 rounded-full opacity-70" 
            style={{ backgroundColor: confidenceColor }}
          />
          <span className="metric-meta capitalize">{entry.confidence} confidence</span>
          <span className="metric-meta opacity-50">·</span>
          <span className="metric-meta">{relativeTime}</span>
        </div>
      </div>
    </motion.div>
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
