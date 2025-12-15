'use client'


import { Card } from '@/components/ui/card'
import { Leaf, Map, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'


const stats = [
{ label: 'Fields Monitored', value: '12', icon: Map },
{ label: 'Avg Crop Health', value: '82%', icon: Leaf },
{ label: 'Active Alerts', value: '2', icon: AlertTriangle },
]


export default function Dashboard() {
return (
<main className="max-w-7xl mx-auto px-10 py-12">
<motion.div
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
className="mb-10"
>
<h1 className="text-4xl font-semibold tracking-tight">KurimaSense</h1>
<p className="text-slate-400 mt-2">
Know your fields. Grow with confidence.
</p>
</motion.div>


<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{stats.map((s, i) => (
<motion.div
key={s.label}
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: i * 0.1 }}
>
<Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
<s.icon className="w-8 h-8 text-emerald-400 mb-4" />
<div className="text-3xl font-semibold">{s.value}</div>
<div className="text-slate-400 text-sm">{s.label}</div>
</Card>
</motion.div>
))}
</div>


<motion.div
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.4 }}
className="mt-12"
>
<Card className="bg-gradient-to-br from-emerald-500/20 to-green-400/10 border border-emerald-400/20 rounded-3xl p-8">
<h2 className="text-xl font-semibold mb-2">Latest Insight</h2>
<p className="text-slate-300">
NDVI decline detected in Field 3 during flowering stage. Possible moisture stress.
</p>
</Card>
</motion.div>
</main>
)
}