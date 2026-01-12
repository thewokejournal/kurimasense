/**
 * Insight Builder Dry Run
 * 
 * Demonstrates the insight builder with mock field signals.
 * Does not write to database - for testing only.
 * 
 * Run with: npx tsx scripts/insight-dry-run.ts
 */

import { buildInsight, InsightBuilderInput } from '../lib/insights'

console.log('🌾 Insight Builder Dry Run\n')
console.log('Mocking field signals and building insight...\n')

// Mock 3 field signals
const mockInput: InsightBuilderInput = {
  fieldId: 'field-mock-001',
  signals: [
    {
      name: 'NDVI',
      value: 0.72,
      timestamp: new Date(),
    },
    {
      name: 'SoilMoisture',
      value: 35,
      timestamp: new Date(),
      unit: '%',
    },
    {
      name: 'Temperature',
      value: 28,
      timestamp: new Date(),
      unit: '°C',
    },
  ],
  thresholds: [
    {
      name: 'NDVI',
      min: 0.3,
      max: 0.8,
      optimal: 0.65,
    },
    {
      name: 'SoilMoisture',
      min: 20,
      max: 80,
      optimal: 50,
      criticalMin: 10,
    },
    {
      name: 'Temperature',
      min: 15,
      max: 35,
      optimal: 25,
    },
  ],
}

// Build insight using the insight builder
const insight = buildInsight(mockInput)

// Log the final insight object
console.log('Generated Insight:')
console.log('==================')
console.log(JSON.stringify(insight, null, 2))

console.log('\n✅ Dry run complete - no database writes performed')
