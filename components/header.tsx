import Link from 'next/link'
import { Button } from './ui/button'

export default function Header() {
  return (
    <header className="w-full py-4">
      <div className="container flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-full bg-emerald-500 p-1">
            <path d="M12 2L15 8H9L12 2Z" fill="white" />
            <path d="M12 22L9 16H15L12 22Z" fill="white" />
          </svg>
          <span className="font-semibold text-lg">KurimaSense</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/fields" className="text-slate-200 hover:text-white">Fields</Link>
          <Link href="/insights" className="text-slate-200 hover:text-white">Insights</Link>
          <Link href="/pricing" className="text-slate-200 hover:text-white">Pricing</Link>
          <Button size="sm" className="rounded-full">Get started</Button>
        </nav>
      </div>
    </header>
  )
}
