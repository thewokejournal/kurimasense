'use client'

type ContextItem = {
  label: string
  value: string
}

type ContextPanelProps = {
  items: ContextItem[]
}

export default function ContextPanel({ items }: ContextPanelProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-xs text-gray-500">{item.label}</span>
            <span className="text-xs text-gray-600 font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
