import './globals.css'

export const metadata = {
  title: 'KurimaSense',
  description: 'Satellite-powered farming intelligence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
