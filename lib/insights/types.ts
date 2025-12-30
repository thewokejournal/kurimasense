/**
 * Core types for the Insight Builder system
 */

export type Severity = 'info' | 'low' | 'medium' | 'high' | 'critical'

export type Confidence = 'low' | 'medium' | 'high'

export interface Signal {
  name: string
  value: number
  timestamp: Date
  unit?: string
}

export interface Threshold {
  name: string
  min?: number
  max?: number
  optimal?: number
  criticalMin?: number
  criticalMax?: number
}

export interface Insight {
  id: string
  fieldId: string
  severity: Severity
  summary: string
  explanation: string
  confidence: Confidence
  timestamp: Date
  signals: Signal[]
  metadata?: Record<string, any>
}

export interface InsightBuilderInput {
  fieldId: string
  signals: Signal[]
  thresholds: Threshold[]
  metadata?: Record<string, any>
}
