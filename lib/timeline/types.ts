/**
 * Field Timeline Types
 * 
 * Defines the structure for tracking field insights over time.
 * No optional fields, no UI imports, no persistence logic.
 */

/**
 * Trend direction for field health
 */
export enum TrendDirection {
  improving = 'improving',
  stable = 'stable',
  declining = 'declining',
}

/**
 * Individual timeline entry
 */
export interface TimelineEntry {
  timestamp: string // ISO 8601 string
  insightId: string
  insightType: string
  severity: string
  confidence: string
}

/**
 * Field timeline containing all entries
 */
export interface FieldTimeline {
  fieldId: string
  entries: TimelineEntry[]
}
