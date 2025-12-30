/**
 * Tests for Timeline Stability Analysis
 */

import { calculateStabilityScore } from './stability'
import { FieldTimeline } from './types'

describe('calculateStabilityScore', () => {
  it('should handle empty timeline', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [],
    }

    const result = calculateStabilityScore(timeline)

    expect(result.overallScore).toBe(0)
    expect(result.explanation).toContain('No data available')
  })

  it('should handle single entry timeline', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [
        {
          timestamp: '2025-12-30T10:00:00Z',
          insightId: 'insight-1',
          insightType: 'medium',
          severity: 'medium',
          confidence: 'high',
        },
      ],
    }

    const result = calculateStabilityScore(timeline)

    expect(result.overallScore).toBe(0.5)
    expect(result.trendConsistency).toBe(1.0)
    expect(result.volatilityScore).toBe(1.0)
    expect(result.dataCompletenessScore).toBe(0)
    expect(result.explanation).toContain('Insufficient data')
  })

  it('should score highly stable conditions with consistent severity', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [
        { timestamp: '2025-12-01T10:00:00Z', insightId: '1', insightType: 'medium', severity: 'medium', confidence: 'high' },
        { timestamp: '2025-12-08T10:00:00Z', insightId: '2', insightType: 'medium', severity: 'medium', confidence: 'high' },
        { timestamp: '2025-12-15T10:00:00Z', insightId: '3', insightType: 'medium', severity: 'medium', confidence: 'high' },
        { timestamp: '2025-12-22T10:00:00Z', insightId: '4', insightType: 'medium', severity: 'medium', confidence: 'high' },
        { timestamp: '2025-12-29T10:00:00Z', insightId: '5', insightType: 'medium', severity: 'medium', confidence: 'high' },
      ],
    }

    const result = calculateStabilityScore(timeline, 7)

    expect(result.overallScore).toBeGreaterThan(0.8)
    expect(result.trendConsistency).toBeGreaterThan(0.9)
    expect(result.volatilityScore).toBeGreaterThan(0.9)
    expect(result.dataCompletenessScore).toBeGreaterThan(0.9)
    expect(result.explanation).toContain('highly stable')
  })

  it('should detect and penalize high volatility', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [
        { timestamp: '2025-12-01T10:00:00Z', insightId: '1', insightType: 'info', severity: 'info', confidence: 'high' },
        { timestamp: '2025-12-08T10:00:00Z', insightId: '2', insightType: 'critical', severity: 'critical', confidence: 'high' },
        { timestamp: '2025-12-15T10:00:00Z', insightId: '3', insightType: 'low', severity: 'low', confidence: 'high' },
        { timestamp: '2025-12-22T10:00:00Z', insightId: '4', insightType: 'high', severity: 'high', confidence: 'high' },
        { timestamp: '2025-12-29T10:00:00Z', insightId: '5', insightType: 'info', severity: 'info', confidence: 'high' },
      ],
    }

    const result = calculateStabilityScore(timeline, 7)

    expect(result.overallScore).toBeLessThan(0.5)
    expect(result.volatilityScore).toBeLessThan(0.6)
    expect(result.explanation).toContain('unstable')
  })

  it('should detect and penalize inconsistent trend direction', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [
        { timestamp: '2025-12-01T10:00:00Z', insightId: '1', insightType: 'medium', severity: 'medium', confidence: 'high' },
        { timestamp: '2025-12-08T10:00:00Z', insightId: '2', insightType: 'high', severity: 'high', confidence: 'high' },
        { timestamp: '2025-12-15T10:00:00Z', insightId: '3', insightType: 'medium', severity: 'medium', confidence: 'high' },
        { timestamp: '2025-12-22T10:00:00Z', insightId: '4', insightType: 'high', severity: 'high', confidence: 'high' },
        { timestamp: '2025-12-29T10:00:00Z', insightId: '5', insightType: 'medium', severity: 'medium', confidence: 'high' },
      ],
    }

    const result = calculateStabilityScore(timeline, 7)

    expect(result.trendConsistency).toBeLessThan(0.6)
    expect(result.explanation).toContain('direction changes')
  })

  it('should penalize large data gaps', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [
        { timestamp: '2025-11-01T10:00:00Z', insightId: '1', insightType: 'medium', severity: 'medium', confidence: 'high' },
        { timestamp: '2025-11-08T10:00:00Z', insightId: '2', insightType: 'medium', severity: 'medium', confidence: 'high' },
        // 30-day gap instead of 7
        { timestamp: '2025-12-08T10:00:00Z', insightId: '3', insightType: 'medium', severity: 'medium', confidence: 'high' },
        { timestamp: '2025-12-15T10:00:00Z', insightId: '4', insightType: 'medium', severity: 'medium', confidence: 'high' },
      ],
    }

    const result = calculateStabilityScore(timeline, 7)

    expect(result.dataCompletenessScore).toBeLessThan(0.7)
    expect(result.explanation).toContain('gaps')
  })

  it('should reward gradual progressive trends', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [
        { timestamp: '2025-12-01T10:00:00Z', insightId: '1', insightType: 'high', severity: 'high', confidence: 'high' },
        { timestamp: '2025-12-08T10:00:00Z', insightId: '2', insightType: 'medium', severity: 'medium', confidence: 'high' },
        { timestamp: '2025-12-15T10:00:00Z', insightId: '3', insightType: 'low', severity: 'low', confidence: 'high' },
        { timestamp: '2025-12-22T10:00:00Z', insightId: '4', insightType: 'info', severity: 'info', confidence: 'high' },
      ],
    }

    const result = calculateStabilityScore(timeline, 7)

    // Gradual improvement should have high trend consistency
    expect(result.trendConsistency).toBeGreaterThan(0.7)
    expect(result.overallScore).toBeGreaterThan(0.6)
  })

  it('should be deterministic with same inputs', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [
        { timestamp: '2025-12-01T10:00:00Z', insightId: '1', insightType: 'medium', severity: 'medium', confidence: 'high' },
        { timestamp: '2025-12-08T10:00:00Z', insightId: '2', insightType: 'high', severity: 'high', confidence: 'high' },
        { timestamp: '2025-12-15T10:00:00Z', insightId: '3', insightType: 'medium', severity: 'medium', confidence: 'high' },
      ],
    }

    const result1 = calculateStabilityScore(timeline, 7)
    const result2 = calculateStabilityScore(timeline, 7)
    const result3 = calculateStabilityScore(timeline, 7)

    expect(result1.overallScore).toBe(result2.overallScore)
    expect(result2.overallScore).toBe(result3.overallScore)
    expect(result1.trendConsistency).toBe(result2.trendConsistency)
    expect(result1.volatilityScore).toBe(result2.volatilityScore)
    expect(result1.dataCompletenessScore).toBe(result2.dataCompletenessScore)
  })

  it('should return score between 0 and 1', () => {
    const testCases: FieldTimeline[] = [
      // Highly volatile
      {
        fieldId: 'field-1',
        entries: [
          { timestamp: '2025-12-01T10:00:00Z', insightId: '1', insightType: 'critical', severity: 'critical', confidence: 'high' },
          { timestamp: '2025-12-02T10:00:00Z', insightId: '2', insightType: 'info', severity: 'info', confidence: 'high' },
          { timestamp: '2025-12-03T10:00:00Z', insightId: '3', insightType: 'critical', severity: 'critical', confidence: 'high' },
        ],
      },
      // Very stable
      {
        fieldId: 'field-2',
        entries: [
          { timestamp: '2025-12-01T10:00:00Z', insightId: '1', insightType: 'low', severity: 'low', confidence: 'high' },
          { timestamp: '2025-12-08T10:00:00Z', insightId: '2', insightType: 'low', severity: 'low', confidence: 'high' },
          { timestamp: '2025-12-15T10:00:00Z', insightId: '3', insightType: 'low', severity: 'low', confidence: 'high' },
        ],
      },
    ]

    testCases.forEach((timeline) => {
      const result = calculateStabilityScore(timeline)
      expect(result.overallScore).toBeGreaterThanOrEqual(0)
      expect(result.overallScore).toBeLessThanOrEqual(1)
      expect(result.trendConsistency).toBeGreaterThanOrEqual(0)
      expect(result.trendConsistency).toBeLessThanOrEqual(1)
      expect(result.volatilityScore).toBeGreaterThanOrEqual(0)
      expect(result.volatilityScore).toBeLessThanOrEqual(1)
      expect(result.dataCompletenessScore).toBeGreaterThanOrEqual(0)
      expect(result.dataCompletenessScore).toBeLessThanOrEqual(1)
    })
  })

  it('should have explainable scores', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [
        { timestamp: '2025-12-01T10:00:00Z', insightId: '1', insightType: 'medium', severity: 'medium', confidence: 'high' },
        { timestamp: '2025-12-08T10:00:00Z', insightId: '2', insightType: 'medium', severity: 'medium', confidence: 'high' },
        { timestamp: '2025-12-15T10:00:00Z', insightId: '3', insightType: 'medium', severity: 'medium', confidence: 'high' },
      ],
    }

    const result = calculateStabilityScore(timeline, 7)

    // Explanation should be a non-empty string
    expect(result.explanation).toBeTruthy()
    expect(typeof result.explanation).toBe('string')
    expect(result.explanation.length).toBeGreaterThan(20)
    
    // Should contain relevant keywords
    expect(result.explanation.toLowerCase()).toMatch(/stable|unstable/)
  })
})
