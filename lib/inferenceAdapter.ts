/**
 * Inference Data Adapter
 * Transforms API responses for UI consumption
 */

import type { InferenceResponse } from '@/app/types/inference'

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
 * Format timestamp for display
 */
export function formatInferenceTime(generatedAt: string): string {
  const date = new Date(generatedAt)
  return date.toLocaleString()
}
