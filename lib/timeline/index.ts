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
export {
  calculateTrendDirection,
  getMostSevereEntry,
  getMostRecentEntry,
  countEntriesBySeverity,
  getEntriesInRange,
} from './trend'
export type { StabilityScore, StabilityMetrics } from './stability'
export {
  calculateStability,
  calculateStabilityScore,
  hasRecentFluctuations,
  calculateChangeFrequency,
  getLongestStablePeriod,
} from './stability'
