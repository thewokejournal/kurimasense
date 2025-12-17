'use client'

import FieldHealthCard from './FieldHealthCard'

interface Field {
  name: string
  health: string
  stress: string
}

interface FieldHealthGridProps {
  fields: Field[]
}

export default function FieldHealthGrid({ fields }: FieldHealthGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {fields.map((field, index) => (
        <FieldHealthCard
          key={index}
          name={field.name}
          health={field.health}
          stress={field.stress}
        />
      ))}
    </div>
  )
}
