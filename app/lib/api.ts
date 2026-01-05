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


export interface FetchInferenceOptions {
  fieldId: string
  windowStart: string
  windowEnd: string
}

/**
 * AnalysisRun type matching backend structure (Phase 4.2 contract)
 */
export interface AnalysisRun {
  id: string
  fieldId: string
  windowStart: string
  windowEnd: string
  inference: InferenceResponse // Embedded snapshot (contract uses 'inference', not 'inferenceResponse')
  createdAt: string
}

/**
 * Context Data type (Phase 5)
 * Read-only, descriptive context data. Not persisted.
 */
export interface ContextData {
  source: string
  timeWindow: {
    start: string
    end: string
  }
  fetchedAt: string
  data: Record<string, any>
}

/**
 * Provenance Data type (Phase 6.1)
 * View-time provenance data. Not persisted.
 */
export interface RuleTrace {
  ruleId: string
  ruleName: string
  evaluated: boolean
  outcome?: string | number
  contributesTo: ('status' | 'trend' | 'confidence' | 'category')[]
}

export interface SignalLineage {
  signalType: 'vegetation' | 'weather'
  timestamp: string
  present: boolean
  dataQuality?: 'high' | 'medium' | 'low'
}

export interface CategoryProvenance {
  category: string
  emittedBy: string[]
  emittedAt: string
}

export interface InferenceProvenance {
  ruleTraces: RuleTrace[]
  signalLineage: SignalLineage[]
  categoryProvenance: CategoryProvenance[]
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
 * Phase 4.2: Uses GET /api/fields/:id/analysis-runs endpoint
 * 
 * @param fieldId - Field ID to fetch analysis runs for
 * @returns Promise resolving to array of AnalysisRun
 * @throws Error if request fails
 */
export async function fetchAnalysisRunsByField(fieldId: string): Promise<AnalysisRun[]> {
  const response = await fetch(`${API_BASE_URL}/api/fields/${encodeURIComponent(fieldId)}/analysis-runs`, {
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
 * Context API Client Functions (Phase 5)
 */

/**
 * Fetch context data for a field and time window
 * 
 * Phase 5: Context is read-only, descriptive, and NOT persisted.
 * Loaded only via explicit user action.
 * 
 * @param fieldId - Field ID
 * @param windowStart - Start of time window (ISO 8601)
 * @param windowEnd - End of time window (ISO 8601)
 * @returns Promise resolving to ContextData
 * @throws Error if request fails
 */
export async function fetchContext(
  fieldId: string,
  windowStart: string,
  windowEnd: string
): Promise<ContextData> {
  const params = new URLSearchParams({
    windowStart,
    windowEnd,
  })

  const response = await fetch(`${API_BASE_URL}/api/context/${encodeURIComponent(fieldId)}?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `Failed to fetch context: ${response.statusText}`)
  }

  const result = await response.json()
  return result.success ? result.data : null
}

/**
 * Provenance API Client Functions (Phase 6.1)
 */

/**
 * Generate provenance data for a field and time window
 * 
 * Phase 6.1: Provenance is view-time only, deterministic, NOT persisted.
 * Loaded only via explicit user action.
 * 
 * @param fieldId - Field ID
 * @param windowStart - Start of time window (ISO 8601)
 * @param windowEnd - End of time window (ISO 8601)
 * @returns Promise resolving to InferenceProvenance
 * @throws Error if request fails
 */
export async function generateProvenance(
  fieldId: string,
  windowStart: string,
  windowEnd: string
): Promise<InferenceProvenance> {
  const response = await fetch(`${API_BASE_URL}/api/provenance/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fieldId, windowStart, windowEnd }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `Failed to generate provenance: ${response.statusText}`)
  }

  const result = await response.json()
  return result.success ? result.data : null
}
/**
 * Interpretation Assistant API Client Functions (Phase 6.2)
 */

export interface InterpretationResponse {
  response: string
  refused: boolean
}

/**
 * Get interpretation assistance for an analysis run
 * 
 * Phase 6.2: Assistant has ZERO authority - only restates, defines, or explains stored fields.
 * User-invoked only, session-bound to current AnalysisRun.
 * 
 * @param analysisRunId - Analysis Run ID
 * @param query - User query
 * @returns Promise resolving to InterpretationResponse
 * @throws Error if request fails
 */
export async function getInterpretation(
  analysisRunId: string,
  query: string
): Promise<InterpretationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/interpretation/assist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ analysisRunId, query }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `Failed to get interpretation: ${response.statusText}`)
  }

  const result = await response.json()
  return result.success ? result.data : null
}

