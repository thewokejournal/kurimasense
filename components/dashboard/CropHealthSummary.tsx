'use client'

interface CropHealthSummaryProps {
  score: number
  status: string
  trend: string
}

export default function CropHealthSummary({
  score,
  status,
  trend,
}: CropHealthSummaryProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg p-12 mb-8">
      <div className="text-8xl font-black text-gray-900 tracking-tight mb-6 tabular-nums">
        {score}
      </div>

      <div className="text-xl font-semibold text-gray-700 mb-4">
        {status}
      </div>

      <div className="text-sm text-gray-500 font-medium">
        {trend}
      </div>
    </div>
  )
}
