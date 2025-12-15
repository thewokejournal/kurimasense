'use client'

import { Card } from '@/components/ui/card'
import { Leaf, Map, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

const stats = [
  { label: 'Fields Monitored', value: '12', icon: Map, color: 'text-emerald-400', bg: 'bg-emerald-900/30' },
  { label: 'Avg Crop Health', value: '82%', icon: Leaf, color: 'text-green-400', bg: 'bg-green-900/30' },
  { label: 'Active Alerts', value: '2', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-900/30' },
]

export default function Dashboard() {
  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 bg-gradient-to-br from-[#0b1f17] via-[#0f2f23] to-[#0b1f17] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center md:text-left"
      >
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">KurimaSense</h1>
        <p className="text-slate-300 mt-3 text-lg md:text-xl">Know your fields. Grow with confidence.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          >
            <Card className={`p-6 rounded-3xl shadow-xl ${s.bg} backdrop-blur-lg border border-white/20 hover:scale-105 transition-transform duration-300`}>
              <s.icon className={`w-10 h-10 mb-4 ${s.color}`} />
              <div className="text-4xl font-extrabold text-white mb-1">{s.value}</div>
              <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">{s.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-16"
      >
        <Card className="bg-gradient-to-br from-emerald-500/30 to-green-400/20 border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-white">Latest Insight</h2>
          <p className="text-slate-200 text-lg md:text-xl">
            NDVI decline detected in Field 3 during flowering stage. Possible moisture stress.
          </p>
        </Card>
      </motion.div>
    </main>
  )
}