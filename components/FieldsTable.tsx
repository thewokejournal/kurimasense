'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react'

type HealthStatus = 'Critical' | 'Stressed' | 'Under Observation' | 'Stable' | 'Healthy'
type Trend = 'Improving' | 'Stable' | 'Declining'

interface FieldData {
  name: string
  health: HealthStatus
  trend: Trend
  confidence: 'High' | 'Medium' | 'Low'
  detectedAt: string
  severity: number // For sorting: 5=Critical, 1=Healthy
  requiresAttention: boolean
}

const fields: FieldData[] = [
  {
    name: 'South Parcel',
    health: 'Stressed' as HealthStatus,
    trend: 'Declining' as Trend,
    confidence: 'High' as 'High' | 'Medium' | 'Low',
    detectedAt: '7 days ago',
    severity: 4,
    requiresAttention: true,
  },
  {
    name: 'East Parcel',
    health: 'Under Observation' as HealthStatus,
    trend: 'Stable' as Trend,
    confidence: 'Medium' as 'High' | 'Medium' | 'Low',
    detectedAt: '3 days ago',
    severity: 3,
    requiresAttention: true,
  },
  {
    name: 'North Parcel',
    health: 'Healthy' as HealthStatus,
    trend: 'Improving' as Trend,
    confidence: 'High' as 'High' | 'Medium' | 'Low',
    detectedAt: '14 days ago',
    severity: 1,
    requiresAttention: false,
  },
].sort((a, b) => b.severity - a.severity) // Sort by severity (worst first)

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


export default function FieldsTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="triage-shell"
    >
      <table className="w-full label-text">
        <thead>
          <tr className="text-left text-slate-500">
            <th className="px-6 py-4 font-medium">Priority</th>
            <th className="px-6 py-4 font-medium">Parcel</th>
            <th className="px-6 py-4 font-medium">Health Status</th>
            <th className="px-6 py-4 font-medium">Trend</th>
            <th className="px-6 py-4 font-medium">Confidence</th>
            <th className="px-6 py-4 font-medium">Since Detected</th>
          </tr>
        </thead>

        <tbody>
          {fields.map((field, index) => {
            const TrendIcon = getTrendIcon(field.trend)

            return (
              <motion.tr
                key={field.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.035)' }}
                className={`border-t border-black/5 py-3 ${field.requiresAttention ? 'triage-attention' : ''}`}
              >
                <td className="px-6 py-5">
                  {field.requiresAttention && (
                    <div className="priority-indicator">
                      <AlertCircle className="w-4 h-4 text-slate-600" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-5 font-medium text-slate-900">
                  {field.name}
                </td>
                <td className="px-6 py-5">
                  <span className="health-status-badge text-slate-900">
                    {field.health}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="trend-indicator text-slate-900">
                    <TrendIcon className="w-4 h-4" />
                    <span>{field.trend}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-slate-900">
                  {field.confidence}
                </td>
                <td className="px-6 py-5 text-slate-500">
                  {field.detectedAt}
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </motion.div>
  )
}
