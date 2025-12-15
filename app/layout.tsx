import './globals.css'

export const metadata = {
  title: 'KurimaSense',
  description: 'Satellite-powered farming intelligence',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-[#0b1f17] via-[#0f2f23] to-[#0b1f17] text-slate-100 font-sans antialiased">
        <div className="min-h-screen flex flex-col">
          <header className="p-6 border-b border-white/10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">KurimaSense</h1>
            <p className="text-slate-300 mt-1 text-sm md:text-base">Satellite-powered farming intelligence</p>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="p-6 border-t border-white/10 text-slate-400 text-sm text-center">
            © {new Date().getFullYear()} KurimaSense. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  )
}