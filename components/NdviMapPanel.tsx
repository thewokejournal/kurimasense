'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

export default function NdviMapPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="ndvi-shell"
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
            <h3>NDVI Overview</h3>
            <p className="ndvi-meta">Apr 21 • 10m / pixel</p>
          </div>
        </div>

        <div className="ndvi-metric">
          <span className="label-text">Avg NDVI</span>
          <strong className="value-text tabular-nums">0.72</strong>
        </div>

        <div className="ndvi-metric">
          <span className="label-text">Vegetation Health</span>
          <strong className="value-text good">Optimal</strong>
        </div>

        <div className="ndvi-metric">
          <span className="label-text">Change (7d)</span>
          <strong className="value-text warn">−0.04</strong>
        </div>
      </div>
    </motion.div>
  )
}
