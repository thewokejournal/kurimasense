'use client'

import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function NdviMapPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="ndvi-shell primary-card"
    >
      <div className="ndvi-map-wrap">
        <div className="ndvi-map diagnostic-map" role="img" aria-label="Crop health map showing problem areas">
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

          {/* Simplified legend (no manual controls) */}
          <div className="ndvi-legend-minimal">
            <div className="legend-status">
              <span className="legend-indicator warn" />
              <span>Focus: Low Vigor Zone</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ndvi-panel">
        <div className="ndvi-panel-head">
          <div>
            <h3>Affected Area Report</h3>
            <p className="ndvi-meta">Showing problem zone • Apr 21</p>
          </div>
        </div>

        {/* Data confidence indicators */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span className="confidence-badge high">
            <span className="confidence-dot" />
            High Confidence
          </span>
          <span className="confidence-badge" style={{ color: 'var(--text-muted)' }}>
            8% Cloud Cover
          </span>
          <span className="confidence-indicator" style={{ marginTop: 0 }}>
            Checked: 2h ago
          </span>
        </div>

        <div className="ndvi-metric">
          <span className="label-text">Problem Area Vigor</span>
          <strong className="value-text warn">Weak</strong>
          <span className="confidence-indicator" style={{ marginTop: '4px', fontSize: '9px', opacity: 0.5 }}>
            As of Apr 21
          </span>
        </div>

        <div className="ndvi-metric">
          <span className="label-text">Overall Field Health</span>
          <strong className="value-text" style={{ opacity: 0.6, fontSize: '0.85em' }}>Good</strong>
          <span className="confidence-indicator" style={{ marginTop: '4px', fontSize: '9px', opacity: 0.4 }}>
            30-day average
          </span>
        </div>

        <div className="ndvi-metric">
          <span className="label-text">Severity Level</span>
          <strong className="value-text warn">Moderate Stress</strong>
          <span className="confidence-indicator" style={{ marginTop: '4px', fontSize: '9px', opacity: 0.5 }}>
            First noticed 7 days ago
          </span>
        </div>

        {/* Evidence Section - Technical Details */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ marginBottom: '12px' }}>
            <span className="meta-text uppercase tracking-wider" style={{ fontSize: '9px', opacity: 0.5 }}>
              Technical Evidence
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10px', opacity: 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Affected Zone NDVI:</span>
              <span className="tabular-nums">0.58</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Field Mean NDVI:</span>
              <span className="tabular-nums">0.72</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Deviation:</span>
              <span className="tabular-nums">-18%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
