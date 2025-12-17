'use client'

import CropHealthSummary from '@/components/dashboard/CropHealthSummary'
import FieldHealthGrid from '@/components/dashboard/FieldHealthGrid'
import FieldHealthMap from '@/components/dashboard/FieldHealthMap'
import ContextPanel from '@/components/dashboard/ContextPanel'

const fields = [
  { name: 'Field 1 - Corn', health: '85%', stress: 'Low' },
  { name: 'Field 2 - Soybeans', health: '78%', stress: 'Moderate' },
  { name: 'Field 3 - Wheat', health: '92%', stress: 'Low' },
]

const contextItems = [
  { label: 'Weather', value: 'Sunny, 24°C' },
  { label: 'Rainfall', value: '12mm (last 7 days)' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <CropHealthSummary
        score={82}
        status="Healthy"
        trend="Improving"
      />

      <FieldHealthGrid fields={fields} />

      <FieldHealthMap />

      <ContextPanel items={contextItems} />
    </div>
  )
}
