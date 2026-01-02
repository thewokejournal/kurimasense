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
    >
      {/* Section Title */}
      <div className="mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <h3 className="font-semibold tracking-tight" style={{ fontSize: '15px', opacity: 0.85 }}>
          Field Health Timeline
        </h3>
        <p className="meta-text mt-1" style={{ opacity: 0.45 }}>
          Chronological health events and observations
        </p>
      </div>

      {/* Timeline entries */}
      <div className="relative">
        {/* Vertical connecting line */}
        <div 
          className="absolute left-[7px] top-4 bottom-4"
          style={{
            width: '1px',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))',
          }}
          aria-hidden="true"
        />

        {/* Entries */}
        <div className="space-y-8">
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
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
      className="relative pl-8"
      onMouseEnter={() => onHover?.(entry.insightId)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onSelect?.(entry.insightId)}
    >
      {/* Timeline dot */}
      <div 
        className="absolute left-0 top-1 w-4 h-4 rounded-full flex items-center justify-center"
        style={{ 
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          border: `2px solid ${severityColor}`,
          boxShadow: `0 0 8px ${severityColor}40`,
        }}
        aria-label={`Severity: ${entry.severity}`}
      >
        <div 
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: severityColor }}
        />
      </div>

      {/* Content */}
      <div>
        {/* Date label */}
        <div className="meta-text uppercase tracking-wider mb-2" style={{ opacity: 0.35, fontSize: '10px' }}>
          {formattedDate}
        </div>

        {/* Health event title */}
        <div className="font-semibold tracking-tight mb-2" style={{ fontSize: '14px', lineHeight: '1.4' }}>
          {entry.insightType}
        </div>
        
        {/* Description */}
        <div className="label-text mb-3" style={{ opacity: 0.55, lineHeight: '1.6' }}>
          {getEventDescription(entry.severity, entry.insightType)}
        </div>

        {/* Confidence indicator */}
        <div className="confidence-indicator">
          <span className="confidence-dot" style={{ backgroundColor: confidenceColor }} />
          <span>{entry.confidence} confidence · {relativeTime}</span>
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
