/**
 * Timeline Module
 * 
 * Exports all timeline-related types and utilities
 */

export type { FieldTimeline, TimelineEntry } from './types'
export { TrendDirection } from './types'
export {
  appendTimelineEntry,
  appendTimelineEntries,
  createTimelineEntry,
  createFieldTimeline,
  appendInsightToTimeline,
} from './append'
