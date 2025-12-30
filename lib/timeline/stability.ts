/**
 * Timeline Stability Analysis
 * 
 * Analyzes the stability and variability of field conditions over time.
 */

import { FieldTimeline, TimelineEntry } from './types'

/**
 * Severity weights for stability calculation
 */
const SEVERITY_WEIGHTS: Record<string, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1,
}

/**
 * Stability score result
 */
export interface StabilityScore {
  score: number // 0-1, where 1 is most stable
  variability: 'low' | 'medium' | 'high'
  description: string
}

/**
 * Comprehensive stability metrics
 */
export interface StabilityMetrics {
  overallScore: number // 0-1, where 1 is most stable
  trendConsistency: number // 0-1, how consistent trend direction is
  volatilityScore: number // 0-1, 1 means low volatility
  dataCompletenessScore: number // 0-1, 1 means no gaps
  explanation: string
}

/**
 * Calculate comprehensive stability score
 * Measures consistency of trend direction, penalizes volatility and missing data
 * 
 * Algorithm:
 * 1. Trend Consistency (40% weight): Measures if severity changes are gradual and unidirectional
 * 2. Volatility (40% weight): Measures magnitude of severity swings using coefficient of variation
 * 3. Data Completeness (20% weight): Penalizes gaps in timeline based on expected frequency
 * 
 * @param timeline - The field timeline to analyze
 * @param expectedDaysInterval - Expected days between entries (default: 7)
 * @returns StabilityMetrics with detailed scoring breakdown
 */
export function calculateStabilityScore(
  timeline: FieldTimeline,
  expectedDaysInterval: number = 7
): StabilityMetrics {
  const entries = timeline.entries

  // Handle edge cases
  if (entries.length === 0) {
    return {
      overallScore: 0,
      trendConsistency: 0,
      volatilityScore: 0,
      dataCompletenessScore: 0,
      explanation: 'No data available to assess stability',
    }
  }

  if (entries.length === 1) {
    return {
      overallScore: 0.5,
      trendConsistency: 1.0,
      volatilityScore: 1.0,
      dataCompletenessScore: 0,
      explanation: 'Insufficient data - only one entry available',
    }
  }

  // Calculate component scores
  const trendConsistency = calculateTrendConsistency(entries)
  const volatilityScore = calculateVolatilityScore(entries)
  const dataCompletenessScore = calculateDataCompleteness(entries, expectedDaysInterval)

  // Weighted average (trend and volatility are most important)
  const overallScore =
    trendConsistency * 0.4 + volatilityScore * 0.4 + dataCompletenessScore * 0.2

  // Generate explanation
  const explanation = generateStabilityExplanation(
    overallScore,
    trendConsistency,
    volatilityScore,
    dataCompletenessScore
  )

  return {
    overallScore: Math.max(0, Math.min(1, overallScore)),
    trendConsistency,
    volatilityScore,
    dataCompletenessScore,
    explanation,
  }
}

/**
 * Calculate trend consistency score
 * Measures if severity changes are gradual and in one direction
 * Returns 0-1, where 1 means highly consistent trend
 */
function calculateTrendConsistency(entries: TimelineEntry[]): number {
  if (entries.length < 3) return 1.0

  const severityScores = entries.map(
    (entry) => SEVERITY_WEIGHTS[entry.severity.toLowerCase()] || 3
  )

  // Calculate consecutive differences
  const differences: number[] = []
  for (let i = 1; i < severityScores.length; i++) {
    differences.push(severityScores[i] - severityScores[i - 1])
  }

  // Count direction changes (volatility in trend direction)
  let directionChanges = 0
  for (let i = 1; i < differences.length; i++) {
    // If previous was going up/down and now going opposite direction
    if (differences[i] * differences[i - 1] < 0) {
      directionChanges++
    }
  }

  // Calculate consistency: fewer direction changes = more consistent
  // Normalize by maximum possible changes
  const maxChanges = differences.length - 1
  const consistencyRatio = maxChanges > 0 ? 1 - directionChanges / maxChanges : 1

  // Also consider magnitude of changes - prefer gradual over sudden
  const avgAbsChange =
    differences.reduce((sum, diff) => sum + Math.abs(diff), 0) / differences.length
  
  // Penalize large sudden changes (gradual is better for stability)
  // Changes > 2 severity levels are considered large
  const gradualnessPenalty = Math.min(1, avgAbsChange / 2)
  
  // Combine both factors
  return consistencyRatio * (1 - gradualnessPenalty * 0.3)
}

/**
 * Calculate volatility score
 * Lower volatility = higher score
 * Returns 0-1, where 1 means low volatility (stable)
 */
function calculateVolatilityScore(entries: TimelineEntry[]): number {
  const severityScores = entries.map(
    (entry) => SEVERITY_WEIGHTS[entry.severity.toLowerCase()] || 3
  )

  // Calculate coefficient of variation
  const mean = severityScores.reduce((sum, score) => sum + score, 0) / severityScores.length
  const variance =
    severityScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
    severityScores.length
  const stdDev = Math.sqrt(variance)
  const coefficientOfVariation = mean > 0 ? stdDev / mean : 0

  // Convert CV to stability score (inverse relationship)
  // CV of 0 = perfectly stable (score 1)
  // CV of 1 or higher = very volatile (score approaching 0)
  return Math.max(0, Math.min(1, 1 - coefficientOfVariation))
}

/**
 * Calculate data completeness score
 * Penalizes large gaps between entries
 * Returns 0-1, where 1 means no unexpected gaps
 */
function calculateDataCompleteness(
  entries: TimelineEntry[],
  expectedDaysInterval: number
): number {
  if (entries.length < 2) return 0

  const timestamps = entries.map((entry) => new Date(entry.timestamp).getTime())
  const gaps: number[] = []

  // Calculate gaps in days
  for (let i = 1; i < timestamps.length; i++) {
    const gapMs = timestamps[i] - timestamps[i - 1]
    const gapDays = gapMs / (1000 * 60 * 60 * 24)
    gaps.push(gapDays)
  }

  // Calculate how many gaps exceed expected interval
  const expectedMs = expectedDaysInterval * (1000 * 60 * 60 * 24)
  let gapPenalty = 0

  gaps.forEach((gapDays) => {
    if (gapDays > expectedDaysInterval) {
      // Penalize proportionally to how much it exceeds expected
      const excessRatio = (gapDays - expectedDaysInterval) / expectedDaysInterval
      gapPenalty += Math.min(1, excessRatio) // Cap penalty per gap at 1
    }
  })

  // Normalize penalty by number of gaps
  const avgGapPenalty = gaps.length > 0 ? gapPenalty / gaps.length : 0

  // Convert penalty to score
  return Math.max(0, 1 - avgGapPenalty)
}

/**
 * Generate human-readable explanation of stability
 */
function generateStabilityExplanation(
  overall: number,
  trend: number,
  volatility: number,
  completeness: number
): string {
  const parts: string[] = []

  // Overall assessment
  if (overall >= 0.8) {
    parts.push('Field conditions are highly stable')
  } else if (overall >= 0.6) {
    parts.push('Field conditions show good stability')
  } else if (overall >= 0.4) {
    parts.push('Field conditions show moderate stability')
  } else if (overall >= 0.2) {
    parts.push('Field conditions are somewhat unstable')
  } else {
    parts.push('Field conditions are highly unstable')
  }

  // Trend consistency
  if (trend < 0.5) {
    parts.push('with frequent direction changes')
  } else if (trend < 0.8) {
    parts.push('with some directional variation')
  }

  // Volatility
  if (volatility < 0.5) {
    parts.push('and high severity fluctuations')
  } else if (volatility < 0.8) {
    parts.push('and moderate severity swings')
  }

  // Data completeness
  if (completeness < 0.5) {
    parts.push('Note: Data has significant gaps which may affect accuracy')
  } else if (completeness < 0.8) {
    parts.push('Note: Some data gaps detected')
  }

  return parts.join('. ') + '.'
}

/**
 * Calculate stability score for a field timeline
 * Measures how consistent the field conditions are over time
 * 
 * @param timeline - The field timeline to analyze
 * @param lookbackCount - Number of recent entries to analyze (default: 10)
 * @returns StabilityScore object with score, variability level, and description
 */
export function calculateStability(
  timeline: FieldTimeline,
  lookbackCount: number = 10
): StabilityScore {
  const entries = timeline.entries

  // Need at least 2 entries to calculate stability
  if (entries.length < 2) {
    return {
      score: 1.0,
      variability: 'low',
      description: 'Insufficient data to determine stability',
    }
  }

  // Get recent entries
  const recentEntries = entries.slice(-Math.min(lookbackCount, entries.length))

  // Calculate coefficient of variation for severity scores
  const severityScores = recentEntries.map(
    (entry) => SEVERITY_WEIGHTS[entry.severity.toLowerCase()] || 3
  )

  const mean = severityScores.reduce((sum, score) => sum + score, 0) / severityScores.length
  const variance =
    severityScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
    severityScores.length
  const stdDev = Math.sqrt(variance)
  const coefficientOfVariation = mean > 0 ? stdDev / mean : 0

  // Convert CV to stability score (inverse relationship)
  // Lower CV = higher stability
  const stabilityScore = Math.max(0, Math.min(1, 1 - coefficientOfVariation))

  // Classify variability
  let variability: 'low' | 'medium' | 'high'
  let description: string

  if (coefficientOfVariation < 0.2) {
    variability = 'low'
    description = 'Field conditions are highly stable with minimal variation'
  } else if (coefficientOfVariation < 0.5) {
    variability = 'medium'
    description = 'Field conditions show moderate variation over time'
  } else {
    variability = 'high'
    description = 'Field conditions are highly variable and unstable'
  }

  return {
    score: stabilityScore,
    variability,
    description,
  }
}

/**
 * Check if field has recent severe fluctuations
 * Returns true if there are significant severity swings in recent history
 */
export function hasRecentFluctuations(
  timeline: FieldTimeline,
  windowSize: number = 5,
  threshold: number = 2
): boolean {
  const entries = timeline.entries

  if (entries.length < windowSize) {
    return false
  }

  const recentEntries = entries.slice(-windowSize)
  const severityScores = recentEntries.map(
    (entry) => SEVERITY_WEIGHTS[entry.severity.toLowerCase()] || 3
  )

  // Check for significant jumps between consecutive entries
  for (let i = 1; i < severityScores.length; i++) {
    const diff = Math.abs(severityScores[i] - severityScores[i - 1])
    if (diff >= threshold) {
      return true
    }
  }

  return false
}

/**
 * Calculate the frequency of severity level changes
 * Returns the number of times severity changes between consecutive entries
 */
export function calculateChangeFrequency(timeline: FieldTimeline): number {
  const entries = timeline.entries

  if (entries.length < 2) {
    return 0
  }

  let changeCount = 0
  for (let i = 1; i < entries.length; i++) {
    if (entries[i].severity !== entries[i - 1].severity) {
      changeCount++
    }
  }

  return changeCount
}

/**
 * Get the longest streak of consistent severity
 * Returns the maximum number of consecutive entries with the same severity
 */
export function getLongestStablePeriod(timeline: FieldTimeline): {
  length: number
  severity: string
  startIndex: number
  endIndex: number
} {
  const entries = timeline.entries

  if (entries.length === 0) {
    return { length: 0, severity: '', startIndex: -1, endIndex: -1 }
  }

  let maxLength = 1
  let maxSeverity = entries[0].severity
  let maxStartIndex = 0
  let maxEndIndex = 0

  let currentLength = 1
  let currentSeverity = entries[0].severity
  let currentStartIndex = 0

  for (let i = 1; i < entries.length; i++) {
    if (entries[i].severity === currentSeverity) {
      currentLength++
    } else {
      if (currentLength > maxLength) {
        maxLength = currentLength
        maxSeverity = currentSeverity
        maxStartIndex = currentStartIndex
        maxEndIndex = i - 1
      }
      currentLength = 1
      currentSeverity = entries[i].severity
      currentStartIndex = i
    }
  }

  // Check final streak
  if (currentLength > maxLength) {
    maxLength = currentLength
    maxSeverity = currentSeverity
    maxStartIndex = currentStartIndex
    maxEndIndex = entries.length - 1
  }

  return {
    length: maxLength,
    severity: maxSeverity,
    startIndex: maxStartIndex,
    endIndex: maxEndIndex,
  }
}
