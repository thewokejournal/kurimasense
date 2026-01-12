/**
 * Timeline Append Utility
 * 
 * Appends new timeline entries to a field timeline.
 */

import { FieldTimeline, TimelineEntry } from './types'
import { Insight } from '../insights/types'

/**
 * Append a new entry to a field timeline
 * Returns a new FieldTimeline with the entry added
 */
export function appendTimelineEntry(
  timeline: FieldTimeline,
  entry: TimelineEntry
): FieldTimeline {
  return {
    ...timeline,
    entries: [...timeline.entries, entry],
  }
}

/**
 * Append multiple entries to a field timeline
 * Returns a new FieldTimeline with all entries added
 */
export function appendTimelineEntries(
  timeline: FieldTimeline,
  entries: TimelineEntry[]
): FieldTimeline {
  return {
    ...timeline,
    entries: [...timeline.entries, ...entries],
  }
}

/**
 * Create a new timeline entry from an insight
 */
export function createTimelineEntry(
  insightId: string,
  insightType: string,
  severity: string,
  confidence: string,
  timestamp?: string
): TimelineEntry {
  return {
    timestamp: timestamp || new Date().toISOString(),
    insightId,
    insightType,
    severity,
    confidence,
  }
}

/**
 * Create an empty field timeline
 */
export function createFieldTimeline(fieldId: string): FieldTimeline {
  return {
    fieldId,
    entries: [],
  }
}

/**
 * Append an insight to a field timeline
 * Creates a TimelineEntry from the insight and inserts it in chronological order
 * Does not mutate the original timeline - returns a new FieldTimeline
 * 
 * @param timeline - The existing field timeline
 * @param insight - The insight to append
 * @returns A new FieldTimeline with the insight added in chronological order
 */
export function appendInsightToTimeline(
  timeline: FieldTimeline,
  insight: Insight
): FieldTimeline {
  // Create a timeline entry from the insight
  const newEntry: TimelineEntry = {
    timestamp: insight.timestamp.toISOString(),
    insightId: insight.id,
    insightType: insight.severity, // Using severity as insight type
    severity: insight.severity,
    confidence: insight.confidence,
  }

  // Create a new array with the new entry
  const allEntries = [...timeline.entries, newEntry]

  // Sort entries by timestamp in ascending order (oldest first)
  allEntries.sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  })

  // Return a new timeline object
  return {
    fieldId: timeline.fieldId,
    entries: allEntries,
  }
}
