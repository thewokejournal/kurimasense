'use client'

import { motion } from 'framer-motion'

const fields = [
  {
    name: 'North Parcel',
    crop: 'Zea mays (Maize)',
    health: 'Vigorous',
    ndvi: 0.82,
    updated: '2h ago',
  },
  {
    name: 'East Parcel',
    crop: 'Glycine max (Soybean)',
    health: 'Moderate Vigor',
    ndvi: 0.71,
    updated: '5h ago',
  },
  {
    name: 'South Parcel',
    crop: 'Triticum aestivum (Wheat)',
    health: 'Stress Detected',
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
      <table className="w-full label-text">
        <thead>
          <tr className="text-left text-slate-500">
            <th className="px-6 py-3 font-medium">Parcel</th>
            <th className="px-6 py-3 font-medium">Cultivar</th>
            <th className="px-6 py-3 font-medium">Vigor Status</th>
            <th className="px-6 py-3 font-medium">NDVI</th>
            <th className="px-6 py-3 font-medium">Last Acquired</th>
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
                    field.health === 'Vigorous'
                      ? 'good'
                      : field.health === 'Moderate Vigor'
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
