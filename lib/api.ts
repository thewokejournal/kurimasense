/**
 * Inference API Client
 * Handles communication with the inference endpoint
 */

import type { InferenceResponse } from '@/app/types/inference'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * Fetch inference results for a field within a time window
 */
export async function fetchInference(
  fieldId: string,
  windowStart: string,
  windowEnd: string
): Promise<InferenceResponse> {
  const params = new URLSearchParams({
    fieldId,
    windowStart,
    windowEnd,
  })

  const response = await fetch(`${API_BASE_URL}/api/inference?${params}`)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `Failed to fetch inference: ${response.statusText}`)
  }

  const data = await response.json()
  return data as InferenceResponse
}

/**
 * Get inference for the last N days
 */
export async function fetchRecentInference(
  fieldId: string,
  days: number = 30
): Promise<InferenceResponse> {
  const windowEnd = new Date().toISOString()
  const windowStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  
  return fetchInference(fieldId, windowStart, windowEnd)
}
