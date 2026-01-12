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
            <AlertTriangle className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
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
 * Premium design: Analytical, calm, refined
 */
export function AffectedAreaReportPanel() {
  return (
    <div className="affected-area-panel">
      {/* Header - Refined typography */}
      <div className="mb-6">
        <h3 className="dashboard-card-title mb-1.5">Affected Area Report</h3>
        <p className="dashboard-card-description">Showing problem zone • Apr 21</p>
      </div>

      {/* Confidence - Plain text only */}
      <div className="mb-8">
        <span className="text-sm text-muted">High Confidence</span>
      </div>

      {/* Status Metrics - Spacing-driven grouping */}
      <div className="space-y-5 mb-8">
        <div className="affected-area-status-item">
          <div className="affected-area-label">Problem Area Vigor</div>
          <div className="affected-area-value affected-area-value-warning">Weak</div>
        </div>

        <div className="affected-area-status-item">
          <div className="affected-area-label">Overall Field Health</div>
          <div className="affected-area-value affected-area-value-success">Good</div>
        </div>

        <div className="affected-area-status-item">
          <div className="affected-area-label">Severity Level</div>
          <div className="affected-area-value affected-area-value-caution">Moderate Stress</div>
        </div>
      </div>

      {/* Technical Evidence - Spacing-driven grouping */}
      <div className="pt-6 mt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="metric-section-header" style={{ marginTop: 0, marginBottom: '16px' }}>
          Technical Evidence
        </div>
        <div className="space-y-5">
          <div className="affected-area-evidence-item">
            <div className="affected-area-label">Affected Zone NDVI</div>
            <div className="affected-area-evidence-value affected-area-value-warning">0.58</div>
          </div>
          <div className="affected-area-evidence-item">
            <div className="affected-area-label">Field Mean NDVI</div>
            <div className="affected-area-evidence-value affected-area-value-success">0.72</div>
          </div>
          <div className="affected-area-evidence-item">
            <div className="affected-area-label">Deviation</div>
            <div className="affected-area-evidence-value affected-area-value-caution">-18%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
