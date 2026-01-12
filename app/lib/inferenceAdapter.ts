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
 * Phase 4.3: Labels only (no descriptions that add meaning)
 */
export const STATUS_CONFIG = {
  healthy: {
    label: 'Healthy',
  },
  watch: {
    label: 'Watch',
  },
  stressed: {
    label: 'Stressed',
  },
} as const

/**
 * Trend display configuration
 */
export const TREND_CONFIG = {
  improving: {
    label: 'Improving',
    icon: '↗',
  },
  stable: {
    label: 'Stable',
    icon: '→',
  },
  declining: {
    label: 'Declining',
    icon: '↘',
  },
} as const

/**
 * Confidence display configuration
 * Phase 4.3: Labels only (no descriptions that add meaning)
 */
export const CONFIDENCE_CONFIG = {
  high: {
    label: 'High',
  },
  medium: {
    label: 'Medium',
  },
  low: {
    label: 'Low',
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
