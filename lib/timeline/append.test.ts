/**
 * Tests for Timeline Append Utility
 */

import { appendInsightToTimeline, createFieldTimeline } from './append'
import { Insight } from '../insights/types'
import { FieldTimeline } from './types'

describe('appendInsightToTimeline', () => {
  it('should append insight to empty timeline', () => {
    const timeline = createFieldTimeline('field-1')
    const insight: Insight = {
      id: 'insight-1',
      fieldId: 'field-1',
      severity: 'high',
      summary: 'Test insight',
      explanation: 'Test explanation',
      confidence: 'high',
      timestamp: new Date('2025-12-30T10:00:00Z'),
      signals: [],
    }

    const result = appendInsightToTimeline(timeline, insight)

    expect(result.fieldId).toBe('field-1')
    expect(result.entries).toHaveLength(1)
    expect(result.entries[0].insightId).toBe('insight-1')
    expect(result.entries[0].severity).toBe('high')
    expect(result.entries[0].confidence).toBe('high')
    expect(result.entries[0].timestamp).toBe('2025-12-30T10:00:00.000Z')
  })

  it('should not mutate the original timeline', () => {
    const timeline = createFieldTimeline('field-1')
    const insight: Insight = {
      id: 'insight-1',
      fieldId: 'field-1',
      severity: 'medium',
      summary: 'Test',
      explanation: 'Test',
      confidence: 'medium',
      timestamp: new Date('2025-12-30T10:00:00Z'),
      signals: [],
    }

    const originalLength = timeline.entries.length
    const result = appendInsightToTimeline(timeline, insight)

    expect(timeline.entries.length).toBe(originalLength)
    expect(result.entries.length).toBe(1)
    expect(timeline).not.toBe(result)
  })

  it('should preserve chronological order when appending older insight', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [
        {
          timestamp: '2025-12-30T12:00:00.000Z',
          insightId: 'insight-2',
          insightType: 'medium',
          severity: 'medium',
          confidence: 'high',
        },
      ],
    }

    const olderInsight: Insight = {
      id: 'insight-1',
      fieldId: 'field-1',
      severity: 'high',
      summary: 'Older insight',
      explanation: 'Test',
      confidence: 'high',
      timestamp: new Date('2025-12-30T10:00:00Z'),
      signals: [],
    }

    const result = appendInsightToTimeline(timeline, olderInsight)

    expect(result.entries).toHaveLength(2)
    expect(result.entries[0].insightId).toBe('insight-1') // Older one first
    expect(result.entries[1].insightId).toBe('insight-2') // Newer one second
    expect(result.entries[0].timestamp).toBe('2025-12-30T10:00:00.000Z')
    expect(result.entries[1].timestamp).toBe('2025-12-30T12:00:00.000Z')
  })

  it('should preserve chronological order when appending newer insight', () => {
    const timeline: FieldTimeline = {
      fieldId: 'field-1',
      entries: [
        {
          timestamp: '2025-12-30T10:00:00.000Z',
          insightId: 'insight-1',
          insightType: 'low',
          severity: 'low',
          confidence: 'medium',
        },
      ],
    }

    const newerInsight: Insight = {
      id: 'insight-2',
      fieldId: 'field-1',
      severity: 'critical',
      summary: 'Newer insight',
      explanation: 'Test',
      confidence: 'high',
      timestamp: new Date('2025-12-30T12:00:00Z'),
      signals: [],
    }

    const result = appendInsightToTimeline(timeline, newerInsight)

    expect(result.entries).toHaveLength(2)
    expect(result.entries[0].insightId).toBe('insight-1') // Older one first
    expect(result.entries[1].insightId).toBe('insight-2') // Newer one second
    expect(result.entries[0].timestamp).toBe('2025-12-30T10:00:00.000Z')
    expect(result.entries[1].timestamp).toBe('2025-12-30T12:00:00.000Z')
  })

  it('should handle multiple insights in correct chronological order', () => {
    let timeline = createFieldTimeline('field-1')

    const insight1: Insight = {
      id: 'insight-1',
      fieldId: 'field-1',
      severity: 'medium',
      summary: 'Third chronologically',
      explanation: 'Test',
      confidence: 'high',
      timestamp: new Date('2025-12-30T14:00:00Z'),
      signals: [],
    }

    const insight2: Insight = {
      id: 'insight-2',
      fieldId: 'field-1',
      severity: 'high',
      summary: 'First chronologically',
      explanation: 'Test',
      confidence: 'medium',
      timestamp: new Date('2025-12-30T10:00:00Z'),
      signals: [],
    }

    const insight3: Insight = {
      id: 'insight-3',
      fieldId: 'field-1',
      severity: 'low',
      summary: 'Second chronologically',
      explanation: 'Test',
      confidence: 'low',
      timestamp: new Date('2025-12-30T12:00:00Z'),
      signals: [],
    }

    // Add in non-chronological order
    timeline = appendInsightToTimeline(timeline, insight1)
    timeline = appendInsightToTimeline(timeline, insight2)
    timeline = appendInsightToTimeline(timeline, insight3)

    expect(timeline.entries).toHaveLength(3)
    expect(timeline.entries[0].insightId).toBe('insight-2') // 10:00
    expect(timeline.entries[1].insightId).toBe('insight-3') // 12:00
    expect(timeline.entries[2].insightId).toBe('insight-1') // 14:00
  })

  it('should be deterministic with same inputs', () => {
    const timeline = createFieldTimeline('field-1')
    const insight: Insight = {
      id: 'insight-1',
      fieldId: 'field-1',
      severity: 'info',
      summary: 'Test',
      explanation: 'Test',
      confidence: 'high',
      timestamp: new Date('2025-12-30T10:00:00Z'),
      signals: [],
    }

    const result1 = appendInsightToTimeline(timeline, insight)
    const result2 = appendInsightToTimeline(timeline, insight)

    expect(result1.entries[0]).toEqual(result2.entries[0])
    expect(result1.fieldId).toBe(result2.fieldId)
  })
})
