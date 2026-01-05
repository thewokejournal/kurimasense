/**
 * AnalysisRun Entity Type
 * 
 * Stores a snapshot of an InferenceResponse for a field and time window.
 * The inference result is persisted as-is and not recomputed on read.
 */

import type { InferenceResponse } from './api.js'

export interface AnalysisRun {
  id: string
  fieldId: string
  windowStart: string // ISO 8601 timestamp
  windowEnd: string // ISO 8601 timestamp
  inferenceResponse: InferenceResponse // Full snapshot
  createdAt: string // ISO 8601 timestamp
}

export interface CreateAnalysisRunInput {
  fieldId: string
  windowStart: string
  windowEnd: string
  inferenceResponse: InferenceResponse
}

