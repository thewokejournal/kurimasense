/**
 * Timeline Module Dry Run
 * 
 * Demonstrates the timeline system with mock data.
 * Tests timeline creation, appending, trend analysis, and stability scoring.
 * Does not write to database - for testing only.
 * 
 * Run with: npx tsx scripts/timeline-dry-run.ts
 */

import { buildInsight } from '../lib/insights'
import {
  createFieldTimeline,
  appendInsightToTimeline,
  calculateTrendDirection,
  calculateStabilityScore,
  TrendDirection,
} from '../lib/timeline'

console.log('🌾 Timeline Module Dry Run\n')
console.log('Demonstrating timeline creation, trend analysis, and stability scoring...\n')

// Create an empty timeline for a field
let timeline = createFieldTimeline('field-demo-001')
console.log('✓ Created empty timeline for field-demo-001')

// Generate a series of insights with varying severity over time
const insightData = [
  { date: '2025-12-01T10:00:00Z', ndvi: 0.45, severity: 'medium' },
  { date: '2025-12-08T10:00:00Z', ndvi: 0.42, severity: 'medium' },
  { date: '2025-12-15T10:00:00Z', ndvi: 0.38, severity: 'high' },
  { date: '2025-12-22T10:00:00Z', ndvi: 0.52, severity: 'medium' },
  { date: '2025-12-29T10:00:00Z', ndvi: 0.55, severity: 'low' },
  { date: '2026-01-05T10:00:00Z', ndvi: 0.60, severity: 'low' },
]

console.log('\nGenerating and appending insights to timeline...')
insightData.forEach((data, index) => {
  const insight = buildInsight({
    fieldId: 'field-demo-001',
    signals: [
      {
        name: 'NDVI',
        value: data.ndvi,
        timestamp: new Date(data.date),
      },
    ],
    thresholds: [
      {
        name: 'NDVI',
        min: 0.3,
        max: 0.8,
        optimal: 0.65,
      },
    ],
  })

  // Manually override timestamp and severity for demo purposes
  insight.timestamp = new Date(data.date)
  insight.severity = data.severity as any

  timeline = appendInsightToTimeline(timeline, insight)
  console.log(`  ${index + 1}. ${data.date.split('T')[0]} - Severity: ${data.severity.padEnd(8)} NDVI: ${data.ndvi}`)
})

console.log(`\n✓ Timeline now has ${timeline.entries.length} entries`)

// Analyze trend direction
console.log('\n' + '='.repeat(80))
console.log('TREND ANALYSIS')
console.log('='.repeat(80))

const trend = calculateTrendDirection(timeline)
console.log(`\nTrend Direction: ${trend.toUpperCase()}`)

const trendEmoji = 
  trend === TrendDirection.improving ? '📈' :
  trend === TrendDirection.declining ? '📉' :
  '➡️'

const trendDescription =
  trend === TrendDirection.improving ? 'Field health is improving over time' :
  trend === TrendDirection.declining ? 'Field health is declining over time' :
  'Field health remains stable over time'

console.log(`${trendEmoji} ${trendDescription}`)

// Calculate stability score
console.log('\n' + '='.repeat(80))
console.log('STABILITY ANALYSIS')
console.log('='.repeat(80))

const stability = calculateStabilityScore(timeline, 7)

console.log(`\nOverall Stability Score: ${stability.overallScore.toFixed(3)} / 1.000`)
console.log(`\nComponent Scores:`)
console.log(`  • Trend Consistency:    ${stability.trendConsistency.toFixed(3)} (${(stability.trendConsistency * 100).toFixed(1)}%)`)
console.log(`  • Volatility Score:     ${stability.volatilityScore.toFixed(3)} (${(stability.volatilityScore * 100).toFixed(1)}%)`)
console.log(`  • Data Completeness:    ${stability.dataCompletenessScore.toFixed(3)} (${(stability.dataCompletenessScore * 100).toFixed(1)}%)`)

console.log(`\nExplanation: ${stability.explanation}`)

// Display visual representation
console.log('\n' + '='.repeat(80))
console.log('TIMELINE VISUALIZATION')
console.log('='.repeat(80))

console.log('\nSeverity over time:')
timeline.entries.forEach((entry, index) => {
  const date = entry.timestamp.split('T')[0]
  const severityBar = getSeverityBar(entry.severity)
  const confidenceBadge = entry.confidence === 'high' ? '✓' : entry.confidence === 'medium' ? '~' : '?'
  console.log(`  ${date}  ${severityBar}  [${confidenceBadge}]`)
})

console.log('\nLegend:')
console.log('  █ = Critical  ▓ = High  ▒ = Medium  ░ = Low  · = Info')
console.log('  [✓] = High confidence  [~] = Medium confidence  [?] = Low confidence')

// Summary
console.log('\n' + '='.repeat(80))
console.log('SUMMARY')
console.log('='.repeat(80))

console.log(`\nField: ${timeline.fieldId}`)
console.log(`Total Entries: ${timeline.entries.length}`)
console.log(`Date Range: ${timeline.entries[0].timestamp.split('T')[0]} to ${timeline.entries[timeline.entries.length - 1].timestamp.split('T')[0]}`)
console.log(`Trend: ${trend.toUpperCase()} ${trendEmoji}`)
console.log(`Stability: ${(stability.overallScore * 100).toFixed(1)}% ${getStabilityEmoji(stability.overallScore)}`)

console.log('\n✅ Dry run complete - no database writes performed\n')

// Helper function to create visual severity bar
function getSeverityBar(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return '████████████████████ Critical'
    case 'high':
      return '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ High'
    case 'medium':
      return '▒▒▒▒▒▒▒▒▒▒ Medium'
    case 'low':
      return '░░░░░ Low'
    case 'info':
      return '·· Info'
    default:
      return severity
  }
}

// Helper function to get stability emoji
function getStabilityEmoji(score: number): string {
  if (score >= 0.8) return '🟢'
  if (score >= 0.6) return '🟡'
  if (score >= 0.4) return '🟠'
  return '🔴'
}
