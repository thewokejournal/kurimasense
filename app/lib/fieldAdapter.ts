/**
 * Field Data Adapter
 * Provides UI display formatting for Field entities
 * 
 * No business logic
 * All mappings are explicit and presentational only
 */

import type { Field } from './api'

/**
 * Format field creation date for display
 */
export function formatFieldCreatedAt(createdAt: string): string {
  const date = new Date(createdAt)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format field creation date with time for display
 */
export function formatFieldCreatedAtWithTime(createdAt: string): string {
  const date = new Date(createdAt)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Check if a field has geometry
 */
export function hasGeometry(field: Field): boolean {
  return field.geometry !== null && field.geometry !== undefined && field.geometry.trim() !== ''
}


