/**
 * Inference API Client
 * Handles communication with the inference endpoint
 */

import type { InferenceResponse } from '@/app/types/inference'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface FetchInferenceOptions {
  fieldId: string
  windowStart: string
  windowEnd: string
}

/**
 * Fetch inference results for a field within a time window
 * 
 * @param options - Field ID and time window parameters
 * @returns Promise resolving to InferenceResponse
 * @throws Error if request fails
 */
export async function fetchInference(
  options: FetchInferenceOptions
): Promise<InferenceResponse> {
  const { fieldId, windowStart, windowEnd } = options

  const params = new URLSearchParams({
    fieldId,
    windowStart,
    windowEnd,
  })

  const response = await fetch(`${API_BASE_URL}/api/inference?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `Failed to fetch inference: ${response.statusText}`)
  }

  const data: InferenceResponse = await response.json()
  return data
}
