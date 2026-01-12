/**
 * Tests for Timeline Trend Analysis
 */

import { calculateTrendDirection } from './trend'
import { FieldTimeline, TrendDirection, TimelineEntry } from './types'

describe('calculateTrendDirection', () => {
  it('should return stable for timeline with less than 2 entries', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [],
    }
    expect(calculateTrendDirection(timeline)).toBe(TrendDirection.stable)

    const timelineWithOne: FieldTimeline = {
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
    expect(calculateTrendDirection(timelineWithOne)).toBe(TrendDirection.stable)
  })

  it('should detect declining trend when severity worsens', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [
        // Older entries - better health
        {
          timestamp: '2025-12-25T10:00:00Z',
          insightId: 'insight-1',
          insightType: 'info',
          severity: 'info',
          confidence: 'high',
        },
        {
          timestamp: '2025-12-26T10:00:00Z',
          insightId: 'insight-2',
          insightType: 'low',
          severity: 'low',
          confidence: 'high',
        },
        {
          timestamp: '2025-12-27T10:00:00Z',
          insightId: 'insight-3',
          insightType: 'medium',
          severity: 'medium',
          confidence: 'high',
        },
        // Newer entries - worse health
        {
          timestamp: '2025-12-28T10:00:00Z',
          insightId: 'insight-4',
          insightType: 'high',
          severity: 'high',
          confidence: 'high',
        },
        {
          timestamp: '2025-12-29T10:00:00Z',
          insightId: 'insight-5',
          insightType: 'high',
          severity: 'high',
          confidence: 'high',
        },
        {
          timestamp: '2025-12-30T10:00:00Z',
          insightId: 'insight-6',
          insightType: 'critical',
          severity: 'critical',
          confidence: 'high',
        },
      ],
    }

    expect(calculateTrendDirection(timeline)).toBe(TrendDirection.declining)
  })

  it('should detect improving trend when severity improves', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [
        // Older entries - worse health
        {
          timestamp: '2025-12-25T10:00:00Z',
          insightId: 'insight-1',
          insightType: 'critical',
          severity: 'critical',
          confidence: 'high',
        },
        {
          timestamp: '2025-12-26T10:00:00Z',
          insightId: 'insight-2',
          insightType: 'high',
          severity: 'high',
          confidence: 'high',
        },
        {
          timestamp: '2025-12-27T10:00:00Z',
          insightId: 'insight-3',
          insightType: 'high',
          severity: 'high',
          confidence: 'high',
        },
        // Newer entries - better health
        {
          timestamp: '2025-12-28T10:00:00Z',
          insightId: 'insight-4',
          insightType: 'medium',
          severity: 'medium',
          confidence: 'high',
        },
        {
          timestamp: '2025-12-29T10:00:00Z',
          insightId: 'insight-5',
          insightType: 'low',
          severity: 'low',
          confidence: 'high',
        },
        {
          timestamp: '2025-12-30T10:00:00Z',
          insightId: 'insight-6',
          insightType: 'info',
          severity: 'info',
          confidence: 'high',
        },
      ],
    }

    expect(calculateTrendDirection(timeline)).toBe(TrendDirection.improving)
  })

  it('should return stable when changes are within noise threshold', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [
        {
          timestamp: '2025-12-27T10:00:00Z',
          insightId: 'insight-1',
          insightType: 'medium',
          severity: 'medium',
          confidence: 'high',
        },
        {
          timestamp: '2025-12-28T10:00:00Z',
          insightId: 'insight-2',
          insightType: 'medium',
          severity: 'medium',
          confidence: 'high',
        },
        {
          timestamp: '2025-12-29T10:00:00Z',
          insightId: 'insight-3',
          insightType: 'medium',
          severity: 'medium',
          confidence: 'high',
        },
        {
          timestamp: '2025-12-30T10:00:00Z',
          insightId: 'insight-4',
          insightType: 'medium',
          severity: 'medium',
          confidence: 'high',
        },
      ],
    }

    expect(calculateTrendDirection(timeline)).toBe(TrendDirection.stable)
  })

  it('should weight by confidence when calculating trend', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [
        // Older entries - critical but low confidence (should have less impact)
        {
          timestamp: '2025-12-27T10:00:00Z',
          insightId: 'insight-1',
          insightType: 'critical',
          severity: 'critical',
          confidence: 'low',
        },
        {
          timestamp: '2025-12-28T10:00:00Z',
          insightId: 'insight-2',
          insightType: 'critical',
          severity: 'critical',
          confidence: 'low',
        },
        // Newer entries - info but high confidence (more reliable)
        {
          timestamp: '2025-12-29T10:00:00Z',
          insightId: 'insight-3',
          insightType: 'info',
          severity: 'info',
          confidence: 'high',
        },
        {
          timestamp: '2025-12-30T10:00:00Z',
          insightId: 'insight-4',
          insightType: 'info',
          severity: 'info',
          confidence: 'high',
        },
      ],
    }

    // Despite critical severities in older entries, low confidence should reduce their impact
    // High confidence info entries should indicate stable or improving trend
    const result = calculateTrendDirection(timeline)
    expect([TrendDirection.improving, TrendDirection.stable]).toContain(result)
  })

  it('should smooth short-term noise by using lookback window', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [
        // Older stable entries
        { timestamp: '2025-12-20T10:00:00Z', insightId: '1', insightType: 'medium', severity: 'medium', confidence: 'high' },
        { timestamp: '2025-12-21T10:00:00Z', insightId: '2', insightType: 'medium', severity: 'medium', confidence: 'high' },
        { timestamp: '2025-12-22T10:00:00Z', insightId: '3', insightType: 'medium', severity: 'medium', confidence: 'high' },
        // One noisy spike
        { timestamp: '2025-12-23T10:00:00Z', insightId: '4', insightType: 'critical', severity: 'critical', confidence: 'high' },
        // Back to normal
        { timestamp: '2025-12-24T10:00:00Z', insightId: '5', insightType: 'medium', severity: 'medium', confidence: 'high' },
        { timestamp: '2025-12-25T10:00:00Z', insightId: '6', insightType: 'medium', severity: 'medium', confidence: 'high' },
      ],
    }

    // One spike should be smoothed out by averaging
    expect(calculateTrendDirection(timeline)).toBe(TrendDirection.stable)
  })

  it('should be deterministic with same inputs', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [
        { timestamp: '2025-12-28T10:00:00Z', insightId: '1', insightType: 'high', severity: 'high', confidence: 'high' },
        { timestamp: '2025-12-29T10:00:00Z', insightId: '2', insightType: 'medium', severity: 'medium', confidence: 'medium' },
        { timestamp: '2025-12-30T10:00:00Z', insightId: '3', insightType: 'low', severity: 'low', confidence: 'high' },
      ],
    }

    const result1 = calculateTrendDirection(timeline)
    const result2 = calculateTrendDirection(timeline)
    const result3 = calculateTrendDirection(timeline)

    expect(result1).toBe(result2)
    expect(result2).toBe(result3)
  })
})
