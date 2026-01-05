/**
 * Frontend Inference Types
 * Must match backend/src/types/api.ts InferenceResponse (LOCKED contract)
 */

export interface InferenceResponse {
  fieldId: string
  generatedAt: string

  status: 'healthy' | 'watch' | 'stressed'
  trend: 'improving' | 'stable' | 'declining'
  confidence: 'high' | 'medium' | 'low'

  categories: Array<{
    category: 'observation' | 'advisory' | 'alert' | 'forecast'
    message: string
  }>

  explanation: string
}
