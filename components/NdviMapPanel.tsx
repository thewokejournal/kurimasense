'use client'

import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function NdviMapPanel() {
  return (
    <div className="immersive-map-container">
      <div 
        className="ndvi-map diagnostic-map" 
        style={{ 
          height: '100%', 
          maxHeight: 'none', 
          borderRadius: 0, 
          border: 'none',
          aspectRatio: 'auto'
        }} 
        role="img" 
        aria-label="Crop health map showing problem areas"
      >
        {/* Fake satellite texture with focused view */}
        <div className="ndvi-overlay" />

        {/* Highlighted zone indicator (worst health area) */}
        <div className="diagnostic-zone-highlight">
          <div className="zone-pulse" />
        </div>

        {/* Diagnostic Overlay - Plain language explanation */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="diagnostic-overlay"
        >
          <div className="diagnostic-header">
            <AlertTriangle className="w-4 h-4" style={{ color: '#f59e0b' }} />
            <span className="diagnostic-title">Southeast Quadrant</span>
          </div>
          <p className="diagnostic-explanation">
            Crop vigor declining over the past week. This area is significantly weaker than the rest of the field. 
            Likely caused by dry soil conditions starting around April 14.
          </p>
          <div className="diagnostic-location">
            <span className="diagnostic-coords">Lat 40.7128° N, Lon 74.0060° W</span>
            <span className="diagnostic-area">2.4 hectares affected</span>
          </div>
        </motion.div>

        {/* Simplified legend */}
        <div className="ndvi-legend-minimal">
          <div className="legend-status">
            <span className="legend-indicator warn" />
            <span>Focus: Low Vigor Zone</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Extracted Sidebar Panel for Affected Area Report
 */
export function AffectedAreaReportPanel() {
  return (
    <div className="affected-area-panel">
      {/* Header */}
      <div className="metric-section-header mb-4">
        <div className="flex items-center justify-between">
          <span className="meta-text uppercase tracking-wider text-xs">Affected Area Report</span>
          <span className="metric-meta">Apr 21</span>
        </div>
      </div>

      {/* Confidence Badges */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <span className="confidence-badge high">
          <span className="confidence-dot" />
          High Confidence
        </span>
        <span className="confidence-badge opacity-60">
          8% Cloud Cover
        </span>
      </div>

      {/* Status Metrics */}
      <div className="metric-section mb-6">
        <div className="metric-card affected-area-metric">
          <div className="metric-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
            <div className="w-3 h-3 rounded-full bg-red-400" />
          </div>
          <div className="metric-content">
            <div className="metric-label">Problem Area Vigor</div>
            <div className="metric-value-primary text-red-400">Weak</div>
          </div>
        </div>

        <div className="metric-card affected-area-metric">
          <div className="metric-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.4)' }}>
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="metric-content">
            <div className="metric-label">Overall Field Health</div>
            <div className="metric-value-primary text-green-400">Good</div>
          </div>
        </div>

        <div className="metric-card affected-area-metric">
          <div className="metric-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)' }}>
            <div className="w-3 h-3 rounded-full bg-amber-400" />
          </div>
          <div className="metric-content">
            <div className="metric-label">Severity Level</div>
            <div className="metric-value-primary text-amber-400">Moderate Stress</div>
          </div>
        </div>
      </div>

      {/* Technical Evidence */}
      <div className="pt-6 border-t border-border-subtle">
        <div className="metric-section-header mb-4">
          <span className="meta-text uppercase tracking-wider text-xs">Technical Evidence</span>
        </div>
        <div className="metric-section">
          <div className="metric-card">
            <div className="metric-content">
              <div className="metric-label">Affected Zone NDVI</div>
              <div className="metric-value text-red-400">0.58</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-content">
              <div className="metric-label">Field Mean NDVI</div>
              <div className="metric-value text-green-400">0.72</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-content">
              <div className="metric-label">Deviation</div>
              <div className="metric-value text-amber-400">-18%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
