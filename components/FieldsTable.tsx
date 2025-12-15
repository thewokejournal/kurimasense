'use client'

import { motion } from 'framer-motion'

const fields = [
  {
    name: 'North Field',
    crop: 'Maize',
    health: 'Good',
    ndvi: 0.82,
    updated: '2h ago',
  },
  {
    name: 'East Plot',
    crop: 'Soybean',
    health: 'Moderate',
    ndvi: 0.71,
    updated: '5h ago',
  },
  {
    name: 'South Block',
    crop: 'Wheat',
    health: 'At Risk',
    ndvi: 0.58,
    updated: '1d ago',
  },
]

export default function FieldsTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="table-shell"
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            <th className="px-6 py-3 font-medium">Field</th>
            <th className="px-6 py-3 font-medium">Crop</th>
            <th className="px-6 py-3 font-medium">Health</th>
            <th className="px-6 py-3 font-medium">NDVI</th>
            <th className="px-6 py-3 font-medium">Updated</th>
          </tr>
        </thead>

        <tbody>
          {fields.map((field) => (
            <motion.tr
              key={field.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.035)' }}
              className="border-t border-black/5"
            >
              <td className="px-6 py-4 font-medium text-slate-900">
                {field.name}
              </td>
              <td className="px-6 py-4">{field.crop}</td>
              <td className="px-6 py-4">
                <span
                  className={`status ${
                    field.health === 'Good'
                      ? 'good'
                      : field.health === 'Moderate'
                      ? 'moderate'
                      : 'risk'
                  }`}
                >
                  {field.health}
                </span>
              </td>
              <td className="px-6 py-4">{field.ndvi}</td>
              <td className="px-6 py-4 text-slate-500">
                {field.updated}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}
