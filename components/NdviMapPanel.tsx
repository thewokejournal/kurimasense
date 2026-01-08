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
    <div className="dashboard-card border-none bg-transparent p-0 shadow-none hover:transform-none">
      <div className="mb-4">
        <h3 className="dashboard-card-title text-base">Affected Area Report</h3>
        <p className="dashboard-card-description">Showing problem zone • Apr 21</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <span className="confidence-badge high">
          <span className="confidence-dot" />
          High Confidence
        </span>
        <span className="confidence-badge opacity-60">
          8% Cloud Cover
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-3 px-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <span className="text-sm text-secondary font-medium">Problem Area Vigor</span>
          <strong className="text-sm font-bold text-red-400">Weak</strong>
        </div>

        <div className="flex justify-between items-center py-3 px-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <span className="text-sm text-secondary font-medium">Overall Field Health</span>
          <strong className="text-sm font-bold text-green-400">Good</strong>
        </div>

        <div className="flex justify-between items-center py-3 px-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <span className="text-sm text-secondary font-medium">Severity Level</span>
          <strong className="text-sm font-bold text-amber-400">Moderate Stress</strong>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border-subtle">
        <span className="text-xs font-bold uppercase tracking-widest text-muted block mb-4">
          Technical Evidence
        </span>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center py-2 px-3 bg-surface-soft/40 rounded border border-border-subtle">
            <span className="text-xs text-secondary font-medium">Affected Zone NDVI:</span>
            <span className="text-xs font-mono tabular-nums font-bold text-red-400">0.58</span>
          </div>
          <div className="flex justify-between items-center py-2 px-3 bg-surface-soft/40 rounded border border-border-subtle">
            <span className="text-xs text-secondary font-medium">Field Mean NDVI:</span>
            <span className="text-xs font-mono tabular-nums font-bold text-green-400">0.72</span>
          </div>
          <div className="flex justify-between items-center py-2 px-3 bg-surface-soft/40 rounded border border-border-subtle">
            <span className="text-xs text-secondary font-medium">Deviation:</span>
            <span className="text-xs font-mono tabular-nums font-bold text-amber-400">-18%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
