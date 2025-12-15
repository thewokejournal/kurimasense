'use client'

import { motion } from 'framer-motion'
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
        <div className="ndvi-map" role="img" aria-label="NDVI map preview">
          {/* Fake satellite texture */}
          <div className="ndvi-overlay" />

          {/* NDVI legend (subtle, non-interactive) */}
          <div className="ndvi-legend" aria-hidden>
            <div className="legend-bar" />
            <div className="legend-labels">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ndvi-panel">
        <div className="ndvi-panel-head">
          <div>
            <h3>Vegetation Index</h3>
            <p className="ndvi-meta">Apr 21 • 10m GSD</p>
          </div>
        </div>

        {/* Data confidence indicators */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span className="confidence-badge high">
            <span className="confidence-dot" />
            95% Model Certainty
          </span>
          <span className="confidence-badge" style={{ color: 'var(--text-muted)' }}>
            8% Cloud Cover
          </span>
          <span className="confidence-indicator" style={{ marginTop: 0 }}>
            Acquired: 2h ago
          </span>
        </div>

        <div className="ndvi-metric">
          <span className="label-text">Mean NDVI</span>
          <strong className="value-text tabular-nums">0.72</strong>
        </div>

        <div className="ndvi-metric">
          <span className="label-text">Canopy Status</span>
          <strong className="value-text good">Vigorous</strong>
        </div>

        <div className="ndvi-metric">
          <span className="label-text">7-day Trend</span>
          <strong className="value-text warn">−0.04</strong>
        </div>
      </div>
    </motion.div>
  )
}
