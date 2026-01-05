'use client'

interface FieldHealthCardProps {
  name: string
  health: string
  stress: string
}

export default function FieldHealthCard({ name, health, stress }: FieldHealthCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="text-sm font-semibold text-gray-900 mb-2">
        {name}
      </div>
      <div className="text-xs text-gray-600 mb-1">
        Health: {health}
      </div>
      <div className="text-xs text-gray-600">
        Stress: {stress}
      </div>
    </div>
  )
}
