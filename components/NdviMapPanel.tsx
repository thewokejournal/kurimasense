'use client'

import { motion } from 'framer-motion'

export default function NdviMapPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="ndvi-shell"
    >
      <div className="ndvi-map">
        {/* Fake satellite texture */}
        <div className="ndvi-overlay" />
      </div>

      <div className="ndvi-panel">
        <h3>NDVI Overview</h3>

        <div className="ndvi-metric">
          <span>Avg NDVI</span>
          <strong>0.72</strong>
        </div>

        <div className="ndvi-metric">
          <span>Vegetation Health</span>
          <strong className="good">Optimal</strong>
        </div>

        <div className="ndvi-metric">
          <span>Change (7d)</span>
          <strong className="warn">−0.04</strong>
        </div>
      </div>
    </motion.div>
  )
}
