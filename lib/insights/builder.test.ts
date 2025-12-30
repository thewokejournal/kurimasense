/**
 * Tests for Insight Builder
 * 
 * Verifies deterministic behavior and testability of the insight builder
 */

import { InsightsBuilder, buildInsight } from './builder'
import { Signal, Threshold, InsightBuilderInput, Severity } from './types'

describe('InsightsBuilder', () => {
  describe('Critical severity detection', () => {
    it('should detect critical high threshold breach', () => {
      const input: InsightBuilderInput = {
        fieldId: 'field-1',
        signals: [
          {
            name: 'NDVI',
            value: 0.95,
            timestamp: new Date('2025-12-30T12:00:00Z'),
          },
        ],
        thresholds: [
          {
            name: 'NDVI',
            min: 0.3,
            max: 0.8,
            criticalMax: 0.9,
          },
        ],
      }

      const insight = buildInsight(input)

      expect(insight.severity).toBe('critical')
      expect(insight.summary).toContain('Critical')
      expect(insight.summary).toContain('NDVI')
      expect(insight.fieldId).toBe('field-1')
      expect(insight.signals).toHaveLength(1)
    })

    it('should detect critical low threshold breach', () => {
      const input: InsightBuilderInput = {
        fieldId: 'field-2',
        signals: [
          {
            name: 'SoilMoisture',
            value: 5,
            timestamp: new Date('2025-12-30T12:00:00Z'),
            unit: '%',
          },
        ],
        thresholds: [
          {
            name: 'SoilMoisture',
            min: 20,
            max: 80,
            criticalMin: 10,
          },
        ],
      }

      const insight = buildInsight(input)

      expect(insight.severity).toBe('critical')
      expect(insight.summary).toContain('Critical')
      expect(insight.summary).toContain('SoilMoisture')
      expect(insight.explanation).toContain('5')
      expect(insight.explanation).toContain('%')
    })
  })

  describe('High severity detection', () => {
    it('should detect high threshold breach', () => {
      const input: InsightBuilderInput = {
        fieldId: 'field-3',
        signals: [
          {
            name: 'Temperature',
            value: 38,
            timestamp: new Date('2025-12-30T12:00:00Z'),
            unit: '°C',
          },
        ],
        thresholds: [
          {
            name: 'Temperature',
            min: 15,
            max: 35,
          },
        ],
      }

      const insight = buildInsight(input)

      expect(insight.severity).toBe('high')
      expect(insight.summary).toContain('Temperature')
      expect(insight.summary).toContain('elevated')
    })

    it('should detect low threshold breach', () => {
      const input: InsightBuilderInput = {
        fieldId: 'field-4',
        signals: [
          {
            name: 'NDVI',
            value: 0.25,
            timestamp: new Date('2025-12-30T12:00:00Z'),
          },
        ],
        thresholds: [
          {
            name: 'NDVI',
            min: 0.3,
            max: 0.8,
          },
        ],
      }

      const insight = buildInsight(input)

      expect(insight.severity).toBe('high')
      expect(insight.summary).toContain('NDVI')
      expect(insight.summary).toContain('below normal')
    })
  })

  describe('Medium severity detection', () => {
    it('should detect approaching threshold', () => {
      const input: InsightBuilderInput = {
        fieldId: 'field-5',
        signals: [
          {
            name: 'Humidity',
            value: 88,
            timestamp: new Date('2025-12-30T12:00:00Z'),
            unit: '%',
          },
        ],
        thresholds: [
          {
            name: 'Humidity',
            max: 90,
          },
        ],
      }

      const insight = buildInsight(input)

      expect(insight.severity).toBe('medium')
      expect(insight.summary).toContain('approaching')
    })
  })

  describe('Info severity - optimal conditions', () => {
    it('should detect optimal range', () => {
      const input: InsightBuilderInput = {
        fieldId: 'field-6',
        signals: [
          {
            name: 'NDVI',
            value: 0.71,
            timestamp: new Date('2025-12-30T12:00:00Z'),
          },
        ],
        thresholds: [
          {
            name: 'NDVI',
            optimal: 0.7,
          },
        ],
      }

      const insight = buildInsight(input)

      expect(insight.severity).toBe('info')
      expect(insight.summary).toContain('optimal')
    })

    it('should return info when all signals within range', () => {
      const input: InsightBuilderInput = {
        fieldId: 'field-7',
        signals: [
          {
            name: 'NDVI',
            value: 0.5,
            timestamp: new Date('2025-12-30T12:00:00Z'),
          },
        ],
        thresholds: [
          {
            name: 'NDVI',
            min: 0.3,
            max: 0.8,
          },
        ],
      }

      const insight = buildInsight(input)

      expect(insight.severity).toBe('info')
    })
  })

  describe('Multiple signals prioritization', () => {
    it('should prioritize critical over high severity', () => {
      const input: InsightBuilderInput = {
        fieldId: 'field-8',
        signals: [
          {
            name: 'NDVI',
            value: 0.35, // High: below normal
            timestamp: new Date('2025-12-30T12:00:00Z'),
          },
          {
            name: 'Temperature',
            value: 45, // Critical: severely elevated
            timestamp: new Date('2025-12-30T12:00:00Z'),
            unit: '°C',
          },
        ],
        thresholds: [
          {
            name: 'NDVI',
            min: 0.4,
            max: 0.8,
          },
          {
            name: 'Temperature',
            max: 35,
            criticalMax: 40,
          },
        ],
      }

      const insight = buildInsight(input)

      expect(insight.severity).toBe('critical')
      expect(insight.summary).toContain('Temperature')
    })
  })

  describe('Confidence calculation', () => {
    it('should have high confidence for recent signals', () => {
      const input: InsightBuilderInput = {
        fieldId: 'field-9',
        signals: [
          {
            name: 'NDVI',
            value: 0.95,
            timestamp: new Date(), // Current time
          },
        ],
        thresholds: [
          {
            name: 'NDVI',
            criticalMax: 0.9,
          },
        ],
      }

      const insight = buildInsight(input)

      expect(insight.confidence).toBe('high')
    })

    it('should have lower confidence for old signals', () => {
      const input: InsightBuilderInput = {
        fieldId: 'field-10',
        signals: [
          {
            name: 'NDVI',
            value: 0.95,
            timestamp: new Date('2025-12-01T12:00:00Z'), // ~30 days old
          },
        ],
        thresholds: [
          {
            name: 'NDVI',
            criticalMax: 0.9,
          },
        ],
      }

      const insight = buildInsight(input)

      expect(['medium', 'low']).toContain(insight.confidence)
    })
  })

  describe('Deterministic behavior', () => {
    it('should produce identical results for identical inputs', () => {
      const input: InsightBuilderInput = {
        fieldId: 'field-11',
        signals: [
          {
            name: 'NDVI',
            value: 0.6,
            timestamp: new Date('2025-12-30T12:00:00Z'),
          },
        ],
        thresholds: [
          {
            name: 'NDVI',
            min: 0.3,
            max: 0.8,
          },
        ],
      }

      const insight1 = buildInsight(input)
      const insight2 = buildInsight(input)

      // IDs will differ, but other fields should match
      expect(insight1.severity).toBe(insight2.severity)
      expect(insight1.confidence).toBe(insight2.confidence)
      expect(insight1.summary).toBe(insight2.summary)
      expect(insight1.explanation).toBe(insight2.explanation)
      expect(insight1.fieldId).toBe(insight2.fieldId)
    })
  })

  describe('Insight structure', () => {
    it('should include all required fields', () => {
      const input: InsightBuilderInput = {
        fieldId: 'field-12',
        signals: [
          {
            name: 'NDVI',
            value: 0.5,
            timestamp: new Date('2025-12-30T12:00:00Z'),
          },
        ],
        thresholds: [
          {
            name: 'NDVI',
            min: 0.3,
            max: 0.8,
          },
        ],
        metadata: {
          cropType: 'corn',
          growthStage: 'vegetative',
        },
      }

      const insight = buildInsight(input)

      expect(insight).toHaveProperty('id')
      expect(insight).toHaveProperty('fieldId')
      expect(insight).toHaveProperty('severity')
      expect(insight).toHaveProperty('summary')
      expect(insight).toHaveProperty('explanation')
      expect(insight).toHaveProperty('confidence')
      expect(insight).toHaveProperty('timestamp')
      expect(insight).toHaveProperty('signals')
      expect(insight).toHaveProperty('metadata')

      expect(typeof insight.id).toBe('string')
      expect(insight.id.length).toBeGreaterThan(0)
      expect(insight.timestamp).toBeInstanceOf(Date)
      expect(insight.metadata?.cropType).toBe('corn')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty signals gracefully', () => {
      const input: InsightBuilderInput = {
        fieldId: 'field-13',
        signals: [],
        thresholds: [],
      }

      const insight = buildInsight(input)

      expect(insight.severity).toBe('info')
      expect(insight.summary).toBeDefined()
      expect(insight.explanation).toBeDefined()
    })

    it('should handle signals without matching thresholds', () => {
      const input: InsightBuilderInput = {
        fieldId: 'field-14',
        signals: [
          {
            name: 'UnknownMetric',
            value: 100,
            timestamp: new Date('2025-12-30T12:00:00Z'),
          },
        ],
        thresholds: [
          {
            name: 'NDVI',
            min: 0.3,
            max: 0.8,
          },
        ],
      }

      const insight = buildInsight(input)

      expect(insight.severity).toBe('info')
    })
  })
})
