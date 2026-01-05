/**
 * API Client
 * Handles communication with backend endpoints
 */

import type { InferenceResponse } from '@/app/types/inference'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * Field type matching backend structure
 */
export interface Field {
  id: string
  name: string
  geometry?: string | null
  createdAt: string
}

export interface CreateFieldInput {
  name: string
  geometry?: string | null
}

export interface UpdateFieldInput {
  name?: string
  geometry?: string | null
}

export interface FetchInferenceOptions {
  fieldId: string
  windowStart: string
  windowEnd: string
}

/**
 * AnalysisRun type matching backend structure
 */
export interface AnalysisRun {
  id: string
  fieldId: string
  windowStart: string
  windowEnd: string
  inferenceResponse: InferenceResponse
  createdAt: string
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

/**
 * Fetch analysis runs for a field
 * 
 * @param fieldId - Field ID to fetch analysis runs for
 * @returns Promise resolving to array of AnalysisRun
 * @throws Error if request fails
 */
export async function fetchAnalysisRunsByField(fieldId: string): Promise<AnalysisRun[]> {
  const response = await fetch(`${API_BASE_URL}/api/analysis-runs?fieldId=${encodeURIComponent(fieldId)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `Failed to fetch analysis runs: ${response.statusText}`)
  }

  const result = await response.json()
  return result.success ? result.data : []
}

/**
 * Fetch a single analysis run by ID
 * 
 * @param id - Analysis run ID
 * @returns Promise resolving to AnalysisRun
 * @throws Error if request fails
 */
export async function fetchAnalysisRunById(id: string): Promise<AnalysisRun> {
  const response = await fetch(`${API_BASE_URL}/api/analysis-runs/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `Failed to fetch analysis run: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}

/**
 * Field API Client Functions
 */

/**
 * Fetch all fields
 * 
 * @returns Promise resolving to array of Field
 * @throws Error if request fails
 */
export async function fetchAllFields(): Promise<Field[]> {
  const response = await fetch(`${API_BASE_URL}/api/fields`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `Failed to fetch fields: ${response.statusText}`)
  }

  const result = await response.json()
  return result.success ? result.data : []
}

/**
 * Fetch a single field by ID
 * 
 * @param id - Field ID
 * @returns Promise resolving to Field
 * @throws Error if request fails
 */
export async function fetchFieldById(id: string): Promise<Field> {
  const response = await fetch(`${API_BASE_URL}/api/fields/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `Failed to fetch field: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}

/**
 * Create a new field
 * 
 * @param input - Field creation input
 * @returns Promise resolving to created Field
 * @throws Error if request fails
 */
export async function createField(input: CreateFieldInput): Promise<Field> {
  const response = await fetch(`${API_BASE_URL}/api/fields`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `Failed to create field: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}

/**
 * Update an existing field
 * 
 * @param id - Field ID
 * @param input - Field update input
 * @returns Promise resolving to updated Field
 * @throws Error if request fails
 */
export async function updateField(id: string, input: UpdateFieldInput): Promise<Field> {
  const response = await fetch(`${API_BASE_URL}/api/fields/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `Failed to update field: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}

/**
 * Delete a field
 * 
 * @param id - Field ID
 * @returns Promise resolving when deletion is complete
 * @throws Error if request fails
 */
export async function deleteField(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/fields/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `Failed to delete field: ${response.statusText}`)
  }
}
