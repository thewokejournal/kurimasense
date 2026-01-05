/**
 * Inference Data Adapter
 * Maps InferenceResponse to dashboard component props and provides UI display configs
 * 
 * No business logic or inference rules
 * All mappings are explicit and reversible
 */

import type { InferenceResponse } from '@/app/types/inference'

// ============================================
// DISPLAY CONFIGURATION
// ============================================

/**
 * Status display configuration
 */
export const STATUS_CONFIG = {
  healthy: {
    label: 'Healthy',
    color: 'green',
    description: 'Crops are growing well',
  },
  watch: {
    label: 'Watch',
    color: 'yellow',
    description: 'Monitor closely',
  },
  stressed: {
    label: 'Stressed',
    color: 'red',
    description: 'Requires attention',
  },
} as const

/**
 * Trend display configuration
 */
export const TREND_CONFIG = {
  improving: {
    label: 'Improving',
    icon: '↗',
    color: 'green',
  },
  stable: {
    label: 'Stable',
    icon: '→',
    color: 'blue',
  },
  declining: {
    label: 'Declining',
    icon: '↘',
    color: 'red',
  },
} as const

/**
 * Confidence display configuration
 */
export const CONFIDENCE_CONFIG = {
  high: {
    label: 'High Confidence',
    description: 'Based on comprehensive data',
  },
  medium: {
    label: 'Medium Confidence',
    description: 'Based on partial data',
  },
  low: {
    label: 'Low Confidence',
    description: 'Limited data available',
  },
} as const

/**
 * Category display configuration
 */
export const CATEGORY_CONFIG = {
  observation: {
    label: 'Observation',
    icon: '👁',
    priority: 1,
  },
  advisory: {
    label: 'Advisory',
    icon: '⚠',
    priority: 2,
  },
  alert: {
    label: 'Alert',
    icon: '🚨',
    priority: 3,
  },
  forecast: {
    label: 'Forecast',
    icon: '🔮',
    priority: 0,
  },
} as const

// ============================================
// COMPONENT PROP MAPPERS
// ============================================

/**
 * Map InferenceResponse to CropHealthSummary props
 */
export interface CropHealthSummaryProps {
  score: number
  status: string
  trend: string
}

export function toCropHealthSummaryProps(
  inference: InferenceResponse
): CropHealthSummaryProps {
  // Map confidence to numeric score
  const confidenceScoreMap = {
    high: 90,
    medium: 60,
    low: 30,
  }

  return {
    score: confidenceScoreMap[inference.confidence],
    status: inference.status,
    trend: inference.trend,
  }
}

/**
 * Map InferenceResponse to FieldHealthCard props
 */
export interface FieldHealthCardProps {
  name: string
  health: string
  stress: string
}

export function toFieldHealthCardProps(
  inference: InferenceResponse,
  fieldName: string
): FieldHealthCardProps {
  return {
    name: fieldName,
    health: inference.status,
    stress: inference.confidence,
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get status configuration for UI rendering
 */
export function getStatusConfig(status: InferenceResponse['status']) {
  return STATUS_CONFIG[status]
}

/**
 * Get trend configuration for UI rendering
 */
export function getTrendConfig(trend: InferenceResponse['trend']) {
  return TREND_CONFIG[trend]
}

/**
 * Get confidence configuration for UI rendering
 */
export function getConfidenceConfig(confidence: InferenceResponse['confidence']) {
  return CONFIDENCE_CONFIG[confidence]
}

/**
 * Get category configuration for UI rendering
 */
export function getCategoryConfig(category: InferenceResponse['categories'][0]['category']) {
  return CATEGORY_CONFIG[category]
}

/**
 * Get the highest priority category from inference
 */
export function getPrimaryCategory(inference: InferenceResponse) {
  return inference.categories.sort(
    (a, b) => CATEGORY_CONFIG[b.category].priority - CATEGORY_CONFIG[a.category].priority
  )[0]
}

/**
 * Extract primary category message
 */
export function getPrimaryCategoryMessage(inference: InferenceResponse): string {
  // Return first category message (categories already prioritized by backend)
  return inference.categories[0]?.message || inference.explanation
}

/**
 * Get category type from inference
 */
export function getPrimaryCategoryType(
  inference: InferenceResponse
): 'observation' | 'advisory' | 'alert' | 'forecast' {
  return inference.categories[0]?.category || 'observation'
}

/**
 * Format timestamp for display
 */
export function formatGeneratedAt(generatedAt: string): string {
  const date = new Date(generatedAt)
  return date.toLocaleString()
}

/**
 * Format timestamp for display (alias for compatibility)
 */
export function formatInferenceTime(generatedAt: string): string {
  return formatGeneratedAt(generatedAt)
}

/**
 * Reverse mapping: confidence score to level
 */
export function scoreToConfidence(score: number): 'high' | 'medium' | 'low' {
  if (score >= 70) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}
