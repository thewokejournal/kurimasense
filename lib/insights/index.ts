/**
 * Insight Builder Module
 * 
 * Export all public APIs for the insight builder system
 */

export { InsightsBuilder, buildInsight } from './builder'
export {
  calculateConfidence,
  calculateSignalRecency,
  calculateSignalCompleteness,
  calculateDataConsistency,
  calculateThresholdCertainty,
} from './confidence'
export type { ConfidenceFactors } from './confidence'
export type {
  Insight,
  Signal,
  Threshold,
  Severity,
  Confidence,
  InsightBuilderInput,
} from './types'
