'use client'


import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { useState } from 'react'


const Map = dynamic(() => import('@/components/map'), { ssr: false })


export default function FieldsPage() {
const [polygon, setPolygon] = useState<any>(null)


async function saveField() {
if (!polygon) return alert('Draw a field first')


await fetch(process.env.NEXT_PUBLIC_API_URL + '/fields', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
name: 'My Field',
geometry: polygon,
}),
})


alert('Field saved. Satellite analysis started.')
}


return (
<main className="p-6">
<h2 className="text-2xl font-semibold mb-4">My Fields</h2>
<div className="h-[500px] rounded-2xl overflow-hidden shadow-sm">
<Map onPolygonCreated={setPolygon} />
</div>
<Button onClick={saveField} className="mt-4 rounded-2xl">Save Field</Button>
</main>
)
}
 