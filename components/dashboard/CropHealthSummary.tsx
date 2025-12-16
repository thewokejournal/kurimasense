'use client'

interface CropHealthSummaryProps {
  status: string
  score: number
  trend: 'up' | 'down' | 'stable'
  trendLabel: string
}

export default function CropHealthSummary({
  status,
  score,
  trend,
  trendLabel,
}: CropHealthSummaryProps) {
  const trendSymbol = {
    up: '↑',
    down: '↓',
    stable: '→',
  }

  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    stable: 'text-gray-600',
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-12 shadow-sm">
      <div className="mb-2">
        <span className="text-xs uppercase tracking-wider text-gray-500 opacity-60">Crop Health Status</span>
      </div>
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h2 className="text-6xl font-bold text-gray-900 mb-3">{status}</h2>
          <div className="text-2xl font-semibold text-gray-600 tabular-nums">
            {score}/100
          </div>
        </div>
        <div className={`text-3xl font-bold ${trendColor[trend]}`}>
          {trendSymbol[trend]}
        </div>
      </div>
      <div className="text-sm text-gray-600 border-t border-gray-100 pt-4">
        {trendLabel}
      </div>
    </div>
  )
}
