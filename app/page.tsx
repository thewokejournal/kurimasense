'use client'


import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Leaf, Activity } from 'lucide-react'
import { motion } from 'framer-motion'


export default function Home() {
return (
<main className="p-8 max-w-7xl mx-auto">
<motion.h1
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
className="text-3xl font-bold mb-6"
>
AgriSense Dashboard
</motion.h1>


<div className="grid md:grid-cols-3 gap-6">
<Card className="rounded-2xl shadow-sm">
<CardContent className="p-6">
<MapPin className="w-8 h-8 mb-3 text-emerald-600" />
<h3 className="font-semibold">Fields</h3>
<p className="text-sm text-slate-600">Manage mapped farm fields</p>
</CardContent>
</Card>


<Card className="rounded-2xl shadow-sm">
<CardContent className="p-6">
<Leaf className="w-8 h-8 mb-3 text-green-600" />
<h3 className="font-semibold">Crop Health</h3>
<p className="text-sm text-slate-600">NDVI & growth insights</p>
</CardContent>
</Card>


<Card className="rounded-2xl shadow-sm">
<CardContent className="p-6">
<Activity className="w-8 h-8 mb-3 text-blue-600" />
<h3 className="font-semibold">Alerts</h3>
<p className="text-sm text-slate-600">Stress & anomaly detection</p>
</CardContent>
</Card>
</div>


<div className="mt-8">
<Button size="lg" className="rounded-2xl">Add New Field</Button>
</div>
</main>
)
}