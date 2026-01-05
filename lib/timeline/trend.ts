/**
 * Timeline Trend Analysis
 * 
 * Analyzes timeline entries to determine trend direction.
 */

import { FieldTimeline, TimelineEntry, TrendDirection } from './types'

/**
 * Severity weights for trend calculation
 * Higher values indicate worse conditions
 */
const SEVERITY_WEIGHTS: Record<string, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1,
}

/**
 * Confidence weights for trend calculation
 * Higher values indicate more reliable data
 */
const CONFIDENCE_WEIGHTS: Record<string, number> = {
  high: 1.0,
  medium: 0.7,
  low: 0.4,
}

/**
 * Calculate the trend direction for a field timeline
 * Analyzes the last N entries comparing severity and confidence over time
 * Smooths short-term noise by using moving averages
 * 
 * @param timeline - The field timeline to analyze
 * @param lookbackCount - Number of recent entries to analyze (default: 6)
 * @returns TrendDirection enum value
 */
export function calculateTrendDirection(
  timeline: FieldTimeline,
  lookbackCount: number = 6
): TrendDirection {
  const entries = timeline.entries

  // Need at least 2 entries to determine a trend
  if (entries.length < 2) {
    return TrendDirection.stable
  }

  // Extract the last N entries for analysis
  // Use minimum of lookbackCount or total entries available
  const recentEntries = entries.slice(-Math.min(lookbackCount, entries.length))

  // Need at least 2 entries for comparison
  if (recentEntries.length < 2) {
    return TrendDirection.stable
  }

  // Split entries into two halves for comparison
  // This smooths noise by comparing aggregated periods rather than individual points
  const midpoint = Math.floor(recentEntries.length / 2)
  const olderHalf = recentEntries.slice(0, midpoint)
  const newerHalf = recentEntries.slice(midpoint)

  // Calculate weighted severity scores for both periods
  // Weight by confidence to give more importance to reliable data
  const olderScore = calculateWeightedSeverity(olderHalf)
  const newerScore = calculateWeightedSeverity(newerHalf)

  // Calculate the trend as the difference between newer and older scores
  // Positive difference = conditions are worsening (declining)
  // Negative difference = conditions are improving
  const trendDelta = newerScore - olderScore

  // Define threshold for classifying trend
  // Using 0.3 to filter out minor fluctuations and noise
  // This prevents oscillation between states on small changes
  const NOISE_THRESHOLD = 0.3

  // Classify trend based on delta magnitude
  if (trendDelta > NOISE_THRESHOLD) {
    // Newer entries have higher severity = field health is declining
    return TrendDirection.declining
  } else if (trendDelta < -NOISE_THRESHOLD) {
    // Newer entries have lower severity = field health is improving
    return TrendDirection.improving
  } else {
    // Change is within noise threshold = field health is stable
    return TrendDirection.stable
  }
}

/**
 * Calculate weighted average severity for a set of timeline entries
 * Weights severity by confidence to prioritize reliable data
 * 
 * @param entries - Timeline entries to analyze
 * @returns Weighted severity score (0-5 scale)
 */
function calculateWeightedSeverity(entries: TimelineEntry[]): number {
  if (entries.length === 0) return 0

  let totalWeightedScore = 0
  let totalWeight = 0

  // Calculate weighted sum of severity scores
  entries.forEach((entry) => {
    // Get severity weight (1-5 scale, higher = worse)
    const severityWeight = SEVERITY_WEIGHTS[entry.severity.toLowerCase()] || 3
    
    // Get confidence weight (0-1 scale, higher = more reliable)
    const confidenceWeight = CONFIDENCE_WEIGHTS[entry.confidence.toLowerCase()] || 0.7
    
    // Multiply severity by confidence to reduce impact of low-confidence data
    totalWeightedScore += severityWeight * confidenceWeight
    totalWeight += confidenceWeight
  })

  // Return weighted average, avoiding division by zero
  return totalWeight > 0 ? totalWeightedScore / totalWeight : 0
}

/**
 * Calculate average severity score for a set of timeline entries
 * Simple average without confidence weighting
 */
function calculateAverageSeverity(entries: TimelineEntry[]): number {
  if (entries.length === 0) return 0

  const totalScore = entries.reduce((sum, entry) => {
    const weight = SEVERITY_WEIGHTS[entry.severity.toLowerCase()] || 3
    return sum + weight
  }, 0)

  return totalScore / entries.length
}

/**
 * Get the most severe entry in the timeline
 */
export function getMostSevereEntry(timeline: FieldTimeline): TimelineEntry | null {
  if (timeline.entries.length === 0) return null

  return timeline.entries.reduce((mostSevere, entry) => {
    const currentWeight = SEVERITY_WEIGHTS[entry.severity.toLowerCase()] || 0
    const mostSevereWeight = SEVERITY_WEIGHTS[mostSevere.severity.toLowerCase()] || 0
    return currentWeight > mostSevereWeight ? entry : mostSevere
  })
}

/**
 * Get the most recent entry in the timeline
 */
export function getMostRecentEntry(timeline: FieldTimeline): TimelineEntry | null {
  if (timeline.entries.length === 0) return null
  return timeline.entries[timeline.entries.length - 1]
}

/**
 * Count entries by severity level
 */
export function countEntriesBySeverity(timeline: FieldTimeline): Record<string, number> {
  const counts: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  }

  timeline.entries.forEach((entry) => {
    const severity = entry.severity.toLowerCase()
    if (counts[severity] !== undefined) {
      counts[severity]++
    }
  })

  return counts
}

/**
 * Get entries within a date range
 */
export function getEntriesInRange(
  timeline: FieldTimeline,
  startDate: Date,
  endDate: Date
): TimelineEntry[] {
  return timeline.entries.filter((entry) => {
    const entryDate = new Date(entry.timestamp)
    return entryDate >= startDate && entryDate <= endDate
  })
}
