/**
 * Insight Builder
 * 
 * Generates crop health insights using deterministic rule-based logic.
 * No machine learning - purely threshold-based analysis.
 * 
 * Features:
 * - Accepts fieldId, signals, and thresholds
 * - Produces normalized Insight objects
 * - Generates severity, summary, explanation, and confidence
 * - Deterministic and testable
 */

import { v4 as uuidv4 } from 'uuid'
import { 
  Insight, 
  InsightBuilderInput, 
  Signal, 
  Threshold, 
  Severity,
  Confidence 
} from './types'
import {
  calculateConfidence,
  calculateSignalRecency,
  calculateSignalCompleteness,
  calculateDataConsistency,
  calculateThresholdCertainty,
  ConfidenceFactors,
} from './confidence'

interface RuleMatch {
  severity: Severity
  summaryTemplate: string
  explanationTemplate: string
  thresholdCertainty: number
}

export class InsightsBuilder {
  private input: InsightBuilderInput

  constructor(input: InsightBuilderInput) {
    this.input = input
  }

  /**
   * Build and return a complete Insight object
   */
  build(): Insight {
    const ruleMatch = this.evaluateRules()
    const confidence = this.calculateConfidence(ruleMatch.thresholdCertainty)
    const summary = this.generateSummary(ruleMatch.summaryTemplate)
    const explanation = this.generateExplanation(ruleMatch.explanationTemplate)

    return {
      id: uuidv4(),
      fieldId: this.input.fieldId,
      severity: ruleMatch.severity,
      summary,
      explanation,
      confidence,
      timestamp: new Date(),
      signals: this.input.signals,
      metadata: this.input.metadata,
    }
  }

  /**
   * Evaluate rules against signals and thresholds
   * Returns the highest priority rule match
   */
  private evaluateRules(): RuleMatch {
    const rules: RuleMatch[] = []

    // Evaluate each signal against its threshold
    this.input.signals.forEach((signal) => {
      const threshold = this.findThreshold(signal.name)
      if (!threshold) return

      // Critical high threshold
      if (threshold.criticalMax !== undefined && signal.value > threshold.criticalMax) {
        rules.push({
          severity: 'critical',
          summaryTemplate: `Critical: ${signal.name} severely elevated`,
          explanationTemplate: `${signal.name} value of ${signal.value.toFixed(2)}${signal.unit || ''} significantly exceeds critical threshold of ${threshold.criticalMax}${signal.unit || ''}. Immediate attention required.`,
          thresholdCertainty: calculateThresholdCertainty(
            signal.value,
            threshold.criticalMax,
            true
          ),
        })
      }

      // Critical low threshold
      if (threshold.criticalMin !== undefined && signal.value < threshold.criticalMin) {
        rules.push({
          severity: 'critical',
          summaryTemplate: `Critical: ${signal.name} severely low`,
          explanationTemplate: `${signal.name} value of ${signal.value.toFixed(2)}${signal.unit || ''} is critically below minimum threshold of ${threshold.criticalMin}${signal.unit || ''}. Immediate attention required.`,
          thresholdCertainty: calculateThresholdCertainty(
            signal.value,
            threshold.criticalMin,
            false
          ),
        })
      }

      // High threshold
      if (threshold.max !== undefined && signal.value > threshold.max) {
        rules.push({
          severity: 'high',
          summaryTemplate: `${signal.name} elevated`,
          explanationTemplate: `${signal.name} value of ${signal.value.toFixed(2)}${signal.unit || ''} exceeds normal maximum of ${threshold.max}${signal.unit || ''}. Monitoring recommended.`,
          thresholdCertainty: calculateThresholdCertainty(signal.value, threshold.max, true),
        })
      }

      // Low threshold
      if (threshold.min !== undefined && signal.value < threshold.min) {
        rules.push({
          severity: 'high',
          summaryTemplate: `${signal.name} below normal`,
          explanationTemplate: `${signal.name} value of ${signal.value.toFixed(2)}${signal.unit || ''} is below normal minimum of ${threshold.min}${signal.unit || ''}. Monitoring recommended.`,
          thresholdCertainty: calculateThresholdCertainty(signal.value, threshold.min, false),
        })
      }

      // Medium - approaching threshold
      if (threshold.max !== undefined) {
        const proximityToMax = signal.value / threshold.max
        if (proximityToMax >= 0.85 && proximityToMax <= 1.0) {
          rules.push({
            severity: 'medium',
            summaryTemplate: `${signal.name} approaching upper limit`,
            explanationTemplate: `${signal.name} value of ${signal.value.toFixed(2)}${signal.unit || ''} is ${(proximityToMax * 100).toFixed(0)}% of maximum threshold. Continue monitoring.`,
            thresholdCertainty: 0.7,
          })
        }
      }

      // Optimal range
      if (threshold.optimal !== undefined) {
        const deviation = Math.abs(signal.value - threshold.optimal) / threshold.optimal
        if (deviation < 0.1) {
          rules.push({
            severity: 'info',
            summaryTemplate: `${signal.name} optimal`,
            explanationTemplate: `${signal.name} value of ${signal.value.toFixed(2)}${signal.unit || ''} is within optimal range (target: ${threshold.optimal}${signal.unit || ''}).`,
            thresholdCertainty: 0.9,
          })
        }
      }
    })

    // Return highest severity rule, or default info
    if (rules.length === 0) {
      return {
        severity: 'info',
        summaryTemplate: 'All signals within normal range',
        explanationTemplate: 'All monitored signals are currently within expected thresholds.',
        thresholdCertainty: 0.8,
      }
    }

    // Sort by severity priority
    const severityPriority: Record<Severity, number> = {
      critical: 5,
      high: 4,
      medium: 3,
      low: 2,
      info: 1,
    }

    return rules.sort((a, b) => severityPriority[b.severity] - severityPriority[a.severity])[0]
  }

  /**
   * Calculate overall confidence for the insight
   */
  private calculateConfidence(thresholdCertainty: number): Confidence {
    const expectedSignals = this.input.thresholds.map((t) => t.name)

    const factors: ConfidenceFactors = {
      signalRecency: calculateSignalRecency(this.input.signals),
      signalCompleteness: calculateSignalCompleteness(this.input.signals, expectedSignals),
      dataConsistency: calculateDataConsistency(this.input.signals),
      thresholdCertainty,
    }

    return calculateConfidence(factors)
  }

  /**
   * Generate human-readable summary
   */
  private generateSummary(template: string): string {
    return template
  }

  /**
   * Generate detailed explanation
   */
  private generateExplanation(template: string): string {
    return template
  }

  /**
   * Find threshold for a given signal name
   */
  private findThreshold(signalName: string): Threshold | undefined {
    return this.input.thresholds.find((t) => t.name === signalName)
  }
}

/**
 * Convenience function to build an insight
 */
export function buildInsight(input: InsightBuilderInput): Insight {
  const builder = new InsightsBuilder(input)
  return builder.build()
}
