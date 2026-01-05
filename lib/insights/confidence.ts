/**
 * Confidence calculation utility for insights
 * 
 * Calculates confidence based on:
 * - Signal quality (recency, completeness)
 * - Data consistency
 * - Threshold matching certainty
 */

import { Signal, Confidence } from './types'

export interface ConfidenceFactors {
  signalRecency: number // 0-1, how recent the signals are
  signalCompleteness: number // 0-1, how complete the signal set is
  dataConsistency: number // 0-1, how consistent the signals are
  thresholdCertainty: number // 0-1, how clearly thresholds are exceeded
}

/**
 * Calculate confidence level based on multiple factors
 */
export function calculateConfidence(factors: ConfidenceFactors): Confidence {
  const weights = {
    signalRecency: 0.3,
    signalCompleteness: 0.2,
    dataConsistency: 0.25,
    thresholdCertainty: 0.25,
  }

  const score =
    factors.signalRecency * weights.signalRecency +
    factors.signalCompleteness * weights.signalCompleteness +
    factors.dataConsistency * weights.dataConsistency +
    factors.thresholdCertainty * weights.thresholdCertainty

  if (score >= 0.75) return 'high'
  if (score >= 0.5) return 'medium'
  return 'low'
}

/**
 * Calculate signal recency factor (0-1)
 * Signals older than 7 days have reduced recency score
 */
export function calculateSignalRecency(signals: Signal[]): number {
  if (signals.length === 0) return 0

  const now = new Date()
  const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days in ms

  const recencyScores = signals.map((signal) => {
    const age = now.getTime() - signal.timestamp.getTime()
    return Math.max(0, 1 - age / maxAge)
  })

  return recencyScores.reduce((sum, score) => sum + score, 0) / recencyScores.length
}

/**
 * Calculate signal completeness factor (0-1)
 * Checks if expected signals are present
 */
export function calculateSignalCompleteness(
  signals: Signal[],
  expectedSignals: string[]
): number {
  if (expectedSignals.length === 0) return 1

  const presentSignals = new Set(signals.map((s) => s.name))
  const foundCount = expectedSignals.filter((name) => presentSignals.has(name)).length

  return foundCount / expectedSignals.length
}

/**
 * Calculate data consistency factor (0-1)
 * Checks for outliers and anomalies in signal values
 */
export function calculateDataConsistency(signals: Signal[]): number {
  if (signals.length === 0) return 0
  if (signals.length === 1) return 1

  // Group signals by name
  const signalGroups = new Map<string, number[]>()
  signals.forEach((signal) => {
    if (!signalGroups.has(signal.name)) {
      signalGroups.set(signal.name, [])
    }
    signalGroups.get(signal.name)!.push(signal.value)
  })

  // Calculate consistency for each signal group
  const consistencyScores: number[] = []
  signalGroups.forEach((values) => {
    if (values.length === 1) {
      consistencyScores.push(1)
      return
    }

    const mean = values.reduce((sum, v) => sum + v, 0) / values.length
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)
    const coefficientOfVariation = mean === 0 ? 0 : stdDev / Math.abs(mean)

    // Lower CV means higher consistency (inverted and capped)
    const consistency = Math.max(0, 1 - coefficientOfVariation)
    consistencyScores.push(consistency)
  })

  return consistencyScores.reduce((sum, score) => sum + score, 0) / consistencyScores.length
}

/**
 * Calculate threshold certainty factor (0-1)
 * Measures how clearly a value exceeds a threshold
 */
export function calculateThresholdCertainty(
  value: number,
  threshold: number,
  isExceeding: boolean
): number {
  if (threshold === 0) return 0

  const deviation = Math.abs(value - threshold) / Math.abs(threshold)

  if (isExceeding) {
    // The more we exceed, the higher the certainty (capped at 1)
    return Math.min(1, deviation)
  } else {
    // The closer to threshold without exceeding, the lower the certainty
    return Math.max(0, 1 - deviation * 2)
  }
}
