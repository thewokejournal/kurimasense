'use client'

/**
 * Mini Chart Component
 * Displays a simple bar chart in monochrome (neutral, no color semantics)
 */

interface MiniChartProps {
  data: number[] // Array of values 0-100
  label?: string
}

export function MiniChart({ data, label }: MiniChartProps) {
  // Normalize data to 0-100 range
  const maxValue = Math.max(...data, 1)
  const normalizedData = data.map(v => (v / maxValue) * 100)

  return (
    <div className="mini-chart-wrapper">
      {label && (
        <div className="text-xs text-muted mb-2 font-medium">{label}</div>
      )}
      <div className="mini-chart">
        {normalizedData.map((value, index) => (
          <div
            key={index}
            className="mini-chart-bar"
            style={{ height: `${value}%` }}
            title={`Value: ${data[index]}`}
          />
        ))}
      </div>
    </div>
  )
}

