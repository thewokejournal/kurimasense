'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react'

type HealthStatus = 'Healthy' | 'Stable' | 'Under Observation' | 'Stressed' | 'Critical'
type Trend = 'Improving' | 'Stable' | 'Declining'
type Confidence = 'High' | 'Medium' | 'Low'

interface CropHealthSummaryProps {
  status: HealthStatus
  trend: Trend
  confidence: Confidence
  detectedAt: string
}

const getStatusColor = (status: HealthStatus) => {
  switch (status) {
    case 'Healthy':
      return '#10b981'
    case 'Stable':
      return '#3b82f6'
    case 'Under Observation':
      return '#f59e0b'
    case 'Stressed':
      return '#f97316'
    case 'Critical':
      return '#ef4444'
  }
}

const getTrendIcon = (trend: Trend) => {
  switch (trend) {
    case 'Improving':
      return TrendingUp
    case 'Declining':
      return TrendingDown
    case 'Stable':
      return Minus
  }
}

const getTrendColor = (trend: Trend) => {
  switch (trend) {
    case 'Improving':
      return '#10b981'
    case 'Declining':
      return '#f59e0b'
    case 'Stable':
      return 'var(--text-secondary)'
  }
}

export default function CropHealthSummary({
  status,
  trend,
  confidence,
  detectedAt,
}: CropHealthSummaryProps) {
  const TrendIcon = getTrendIcon(trend)
  const statusColor = getStatusColor(status)
  const trendColor = getTrendColor(trend)

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="crop-health-summary"
    >
      <div className="health-summary-container">
        {/* Primary Status */}
        <div className="health-status-primary">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-6 h-6" style={{ color: statusColor, opacity: 0.9 }} />
            <span className="meta-text uppercase tracking-wider opacity-70">
              Overall Crop Status
            </span>
          </div>
          <h2 className="health-status-value" style={{ color: statusColor }}>
            {status}
          </h2>
        </div>

        {/* Metadata Grid */}
        <div className="health-metadata-grid">
          <div className="health-metadata-item">
            <span className="health-metadata-label">Trend (14-day window)</span>
            <div className="health-metadata-value" style={{ color: trendColor }}>
              <TrendIcon className="w-5 h-5" />
              <span>{trend}</span>
            </div>
          </div>

          <div className="health-metadata-item">
            <span className="health-metadata-label">Confidence</span>
            <div className="health-metadata-value">
              <span className={`confidence-badge ${confidence.toLowerCase()}`}>
                <span className="confidence-dot" />
                {confidence}
              </span>
            </div>
          </div>

          <div className="health-metadata-item">
            <span className="health-metadata-label">Condition Detected</span>
            <div className="health-metadata-value">
              <span style={{ opacity: 0.85 }}>{detectedAt}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
