/**
 * ConfidenceBadge Component
 * 
 * Displays a confidence indicator with tooltip.
 */

'use client'

import { useState } from 'react'

interface ConfidenceBadgeProps {
  confidence: number // 0-1
  source?: string // e.g., 'satellite', 'weather', 'model'
}

export function ConfidenceBadge({ confidence, source }: ConfidenceBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  // Clamp confidence between 0 and 1
  const normalizedConfidence = Math.max(0, Math.min(1, confidence))
  const confidencePercent = Math.round(normalizedConfidence * 100)

  // Get color based on confidence level
  const getConfidenceColor = () => {
    if (normalizedConfidence >= 0.8) return '#10b981' // green
    if (normalizedConfidence >= 0.5) return '#f59e0b' // amber
    return '#ef4444' // red
  }

  // Get confidence level label
  const getConfidenceLevel = () => {
    if (normalizedConfidence >= 0.8) return 'High'
    if (normalizedConfidence >= 0.5) return 'Medium'
    return 'Low'
  }

  const color = getConfidenceColor()
  const level = getConfidenceLevel()

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="inline-flex items-center gap-1 cursor-help focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white/20 rounded-full"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label={`${level} confidence (${confidencePercent}%)${source ? ` from ${source}` : ''}`}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 text-xs whitespace-nowrap rounded pointer-events-none"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div className="font-medium">{level} Confidence</div>
          <div style={{ opacity: 0.7 }}>{confidencePercent}%</div>
          {source && (
            <div style={{ opacity: 0.6, fontSize: '10px', marginTop: '2px' }}>
              Source: {source}
            </div>
          )}
          {/* Tooltip arrow */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 -mt-px"
            style={{
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid rgba(0, 0, 0, 0.9)',
            }}
          />
        </div>
      )}
    </div>
  )
}
