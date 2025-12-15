import Link from 'next/link'
import { Button } from './ui/button'
import { Card } from './ui/card'

export default function Hero() {
  return (
    <section className="py-20">
      <div className="container px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-5xl font-bold leading-tight">Satellite-powered crop intelligence</h1>
          <p className="mt-4 text-lg label-text">Monitor crop health, get NDVI insights and alerts, and make faster farm decisions with high-resolution satellite analytics.</p>
          <div className="mt-6 flex gap-4">
            <Link href="/fields"><Button size="lg" className="rounded-full">Get started</Button></Link>
            <Link href="/fields"><Button size="md" className="rounded-full bg-white text-slate-900 hover:opacity-90">View demo</Button></Link>
          </div>
        </div>

        <div>
          <Card className="p-0 overflow-hidden">
            <div className="h-72 bg-gradient-to-br from-emerald-500/20 to-green-400/10 flex items-center justify-center">
              <div className="meta-text">[Map preview]</div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
